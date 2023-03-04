/** BackBlaze API */
export class B2 {
  private auth?: B2Authorization;
  private authExpires = new Date(0);
  readonly options: B2Options;

  constructor(
    readonly accountId: string,
    readonly applicationKey: string,
    options: Partial<B2Options> = {}
  ) {
    if (!accountId || !applicationKey) {
      throw new Error('accountId and applicationKey are required');
    }

    if (accountId.length !== 12 && accountId.length !== 25) {
      throw new Error('Incorrect accountId passed (should be 12 or 25 characters)');
    }

    this.options = {
      maxConcurrentUploads: 10,
      ...options
    };
  }

  /** Gets the authentication object */
  async getAuthorization() {
    if (!this.auth || this.authExpires < new Date()) {
      const response = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(`${this.accountId}:${this.applicationKey}`)}`
        }
      });

      if (!response.ok) {
        throw new B2Error(await response.json());
      }

      this.auth = (await response.json()) as B2Authorization;
      this.authExpires = new Date(Date.now() + 1000 * 60 * 60 * 24 - 1000);
    }

    return this.auth;
  }

  /** Makes an API request */
  private async request<T>(url: string, json: unknown, init: RequestInit = {}) {
    const auth = await this.getAuthorization();

    const url2 = new URL(url, auth.apiUrl + '/b2api/v2/').toString();
    const headers = new Headers(init.headers);

    headers.set('Authorization', auth.authorizationToken);
    if (json) {
      headers.set('Content-Type', 'application/json');
    }
    if (init.headers) {
      for (const [key, value] of new Headers(init.headers)) {
        headers.set(key, value);
      }
    }
    const response = await fetch(url2, {
      method: init.method ?? (json ? 'POST' : 'GET'),
      ...init,
      headers,
      body: json ? JSON.stringify(json) : init.body
    });

    if (!response.ok) {
      throw new B2Error(await response.json());
    }

    return response.json() as Promise<T>;
  }

  /** Gets a bucket object from an id, which is a simple wrapper for future method calls. */
  bucket(idOrName: string): B2Bucket {
    return new B2Bucket(this, idOrName);
  }

  /**
   * https://www.backblaze.com/b2/docs/b2_list_buckets.html
   *
   * Returns B2Bucket objects instead. To get the data this endpoint returns, use `bucket.getBucketInfo()`,
   * which will return another promise but that one will resolve instantly.
   */
  async listBuckets(options: B2ListBucketOptions = {}): Promise<B2Bucket[]> {
    const auth = await this.getAuthorization();
    const response = (await this.request('b2_list_buckets', {
      accountId: auth.accountId,
      ...options
    })) as { buckets: B2BucketInfo[] };

    return response.buckets.map((info: B2BucketInfo) => new B2Bucket(this, info.bucketId, info));
  }

  async createBucket(options: B2CreateBucketOptions) {
    const bucket = (await this.request('b2_create_bucket', {
      accountId: (await this.getAuthorization()).accountId,
      ...options
    })) as B2BucketInfo;

    return new B2Bucket(this, bucket.bucketId, bucket);
  }

  async createKey(options: B2CreateKeyOptions) {
    return this.request('b2_create_key', {
      accountId: (await this.getAuthorization()).accountId,
      ...options,
      bucketId: options.bucketId
        ? typeof options.bucketId === 'string'
          ? options.bucketId
          : options.bucketId.id
        : undefined
    });
  }

  async deleteKey(keyId: string) {
    await this.request('b2_delete_key', {
      keyId
    });
  }

  async listKeys(options: B2ListKeysOptions = {}) {
    return this.request('b2_list_keys', {
      accountId: (await this.getAuthorization()).accountId,
      ...options
    });
  }
}

export class B2Bucket {
  private uploadTokens: B2UploadToken[] = [];
  private overflowQueue: (() => void)[] = [];

  constructor(readonly b2: B2, readonly id: string, private info?: B2BucketInfo) {
    if (id.length !== 24) {
      throw new Error(
        'Incorrect bucketId passed (should be 24 characters). Did you pass your bucket name instead? If so, use b2.listBuckets() instead.'
      );
    }
  }

  /** https://www.backblaze.com/b2/docs/b2_list_buckets.html */
  async getBucketInfo() {
    if (!this.info) {
      const account = await this.b2.getAuthorization();
      this.info = (await this.b2['request']('b2_list_buckets', {
        accountId: account.accountId,
        bucketId: this.id
      })) as B2BucketInfo;
    }

    return this.info;
  }

  /**
   * https://www.backblaze.com/b2/docs/b2_copy_file.html
   *
   * Same as API above, except `destinationBucketId` can be a string or a B2Bucket object.
   */
  async copyFile(source: string, destination: string, options: B2CopyFileOptions = {}) {
    return this.b2['request']('b2_copy_file', {
      ...options,
      sourceFileId: source,
      destinationBucketId: options.destinationBucketId
        ? typeof options.destinationBucketId === 'string'
          ? options.destinationBucketId
          : options.destinationBucketId.id
        : undefined,
      fileName: destination
    });
  }

  async deleteBucket() {
    await this.b2['request']('b2_delete_bucket', {
      accountId: (await this.b2.getAuthorization()).accountId,
      bucketId: this.id
    });
  }

  async deleteFileVersion(
    fileName: string,
    fileId: string,
    options: B2DeleteFileVersionOptions = {}
  ) {
    await this.b2['request']('b2_delete_file_version', {
      ...options,
      fileName,
      fileId
    });
  }

  async getFileInfo(fileId: string) {
    return this.b2['request']('b2_get_file_info', {
      fileId
    });
  }

  async getUploadUrl() {
    const token: B2UploadToken = {
      url: '',
      token: '',
      expires: 0,
      inUse: true
    };
    this.uploadTokens.push(token);

    const url = (await this.b2['request']('b2_get_upload_url', {
      bucketId: this.id
    })) as B2UploadUrl;

    token.url = url.uploadUrl;
    token.token = url.authorizationToken;
    token.expires = Date.now() + 1000 * 60 * 60 * 24;
    token.inUse = false;

    return url;
  }

  async getUploadToken(): Promise<[B2UploadToken, () => void]> {
    let token: B2UploadToken | undefined;

    while (!token) {
      token = this.uploadTokens.find((t) => !t.inUse);

      if (this.uploadTokens.length >= this.b2.options.maxConcurrentUploads) {
        await new Promise<void>((resolve) => this.overflowQueue.push(resolve));
      } else {
        await this.getUploadUrl();
      }
    }

    token.inUse = true;

    return [
      token,
      () => {
        token!.inUse = false;
        this.overflowQueue.shift()?.();
      }
    ];
  }

  async hideFile(fileName: string, fileId: string) {
    return await this.b2['request']('b2_hide_file', {
      fileName,
      fileId
    });
  }

  async listFileNames(options: B2ListFileNamesOptions = {}) {
    return this.b2['request']('b2_list_file_names', {
      bucketId: this.id,
      ...options
    });
  }

  async listFileVersions(options: B2ListFileVersionsOptions = {}) {
    return this.b2['request']('b2_list_file_versions', {
      bucketId: this.id,
      ...options
    });
  }

  async uploadFile(fileName: string, data: FileSource, options: B2UploadFileOptions = {}) {
    const headers = new Headers();
    const buffer =
      data instanceof Uint8Array
        ? data
        : data instanceof ArrayBuffer
          ? new Uint8Array(data)
          : (data as { arrayBuffer(): Promise<ArrayBuffer> })['arrayBuffer']
            ? await (data as { arrayBuffer(): Promise<ArrayBuffer> }).arrayBuffer()
            : new TextEncoder().encode(data as string);

    headers.set('Content-Length', buffer.byteLength.toString());
    headers.set('Content-Type', options.contentType ?? 'b2/x-auto');
    headers.set('X-Bz-File-Name', encodeURIComponent(fileName));
    if (options.customUploadTimestamp) {
      headers.set(
        'X-Bz-Custom-Upload-Timestamp',
        new Date(options.customUploadTimestamp).getTime().toString()
      );
    }
    if (options.legalHold !== undefined) {
      headers.set('X-Bz-File-Legal-Hold', options.legalHold ? 'on' : 'off');
    }
    if (options.lastModified) {
      headers.set(
        'X-Bz-Info-src_last_modified_millis',
        new Date(options.lastModified).getTime().toString()
      );
    }
    if (options.headers) {
      const inner = new Headers(options.headers);
      for (const header of [
        'content-disposition',
        'content-language',
        'cache-control',
        'expires',
        'content-encoding'
      ]) {
        if (inner.has(header)) {
          headers.set(`X-Bz-Info-${header}`, encodeURIComponent(inner.get(header)!));
          inner.delete(header);
        }
      }
      for (const [key, value] of inner) {
        headers.set(`X-Bz-Info-${key}`, value);
      }
    }

    const sha1 = await crypto.subtle.digest('SHA-1', buffer);
    const sha1hex = Array.from(new Uint8Array(sha1))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    headers.set('X-Bz-Content-Sha1', sha1hex);

    const [token, releaseToken] = await this.getUploadToken();
    try {
      headers.set('Authorization', token.token);

      return await this.b2['request'](token.url, undefined, {
        body: buffer,
        headers,
        method: 'POST'
      });
    } finally {
      releaseToken();
    }
  }
}

export interface B2Options {
  maxConcurrentUploads: number;
}

//

export interface B2Authorization {
  absoluteMinimumPartSize: number;
  accountId: string;
  allowed: {
    bucketId: string | null;
    bucketName: string | null;
    capabilities: B2Capability[];
    namePrefix: string | null;
  };
  apiUrl: string;
  authorizationToken: string;
  downloadUrl: string;
  recommendedPartSize: number;
  s3ApiUrl: string;
}

export type B2Capability =
  | 'bypassGovernance'
  | 'listKeys'
  | 'writeKeys'
  | 'deleteKeys'
  | 'listAllBucketNames'
  | 'listBuckets'
  | 'readBuckets'
  | 'writeBuckets'
  | 'deleteBuckets'
  | 'readBucketEncryption'
  | 'readBucketReplications'
  | 'readBucketRetentions'
  | 'writeBucketEncryption'
  | 'writeBucketReplications'
  | 'writeBucketRetentions'
  | 'listFiles'
  | 'readFiles'
  | 'shareFiles'
  | 'writeFiles'
  | 'deleteFiles'
  | 'readFileRetentions'
  | 'readFileLegalHolds'
  | 'writeFileRetentions'
  | 'writeFileLegalHolds ';

/** https://www.backblaze.com/b2/docs/b2_list_buckets.html#Response */
export interface B2BucketInfo {
  accountId: string;
  bucketId: string;
  bucketName: string;
  bucketType: B2BucketType;
  bucketInfo: { [key: string]: string };
  corsRules: B2CorsRule[];
  fileLockConfiguration: B2FileLockConfiguration;
  defaultServerSideEncryption: B2DefaultServerSideEncryption;
  lifecycleRules: B2LifecycleRule[];
  replicationConfiguration: B2ReplicationConfig;
  revision: number;
  options: unknown;
}

/** https://www.backblaze.com/b2/docs/b2_list_buckets.html#Response */
export type B2BucketType = 'allPublic' | 'allPrivate' | 'restricted' | 'snapshot' | 'shared';

/** https://www.backblaze.com/b2/docs/cors_rules.html */
export interface B2CorsRule {
  corsRuleName: string;
  allowedOrigins: string[];
  allowedOperations: B2CorsOperation[];
  allowedHeaders?: string[];
  exposeHeaders: string[];
  maxAgeSeconds: number;
}

/** https://www.backblaze.com/b2/docs/cors_rules.html */
export type B2CorsOperation =
  | 'b2_upload_file'
  | 'b2_upload_part'
  | 'b2_download_file_by_id'
  | 'b2_download_file_by_name'
  | 's3_delete'
  | 's3_get'
  | 's3_head'
  | 's3_post'
  | 's3_put';

/** TODO: https://www.backblaze.com/b2/docs/file_lock.html */
export interface B2FileLockConfiguration {
  isClientAuthorizedToRead: boolean;
  value: null | unknown;
}

/** TODO: https://www.backblaze.com/b2/docs/server_side_encryption.html */
export interface B2DefaultServerSideEncryption {
  isClientAuthorizedToRead: boolean;
  value: null | unknown;
}

/** https://www.backblaze.com/b2/docs/lifecycle_rules.html */
export interface B2LifecycleRule {
  fileNamePrefix: string;
  daysFromHidingToDeleting: number;
  daysFromUploadingToHiding: number;
}

/** https://www.backblaze.com/b2/docs/replication.html: TODO*/
export interface B2ReplicationConfig {
  asReplicationSource?: unknown;
  asReplicationDestination?: unknown;
}

export interface B2UploadUrl {
  uploadUrl: string;
  authorizationToken: string;
  bucketId: string;
}

//

interface B2UploadToken {
  token: string;
  url: string;
  expires: number;
  inUse: boolean;
}

//

export interface B2ListBucketOptions {
  bucketId?: string;
  bucketName?: string;
  bucketTypes?: B2BucketType[];
}

export interface B2CopyFileOptions {
  destinationBucketId?: B2Bucket | string;
  range?: string;
  metadataDirective?: 'COPY' | 'REPLACE';
  contentType?: string;
  fileInfo?: { [key: string]: string };
  fileRetention?: unknown; // TODO
  legalHold?: unknown; // TODO
  sourceServerSideEncryption?: unknown; // TODO
  destinationServerSideEncryption?: unknown; // TODO
}

export interface B2CreateBucketOptions {
  bucketName: string;
  bucketType?: B2BucketType;
  bucketInfo?: { [key: string]: string };
  corsRules?: unknown;
  fileLockEnabled?: boolean;
  lifecycleRules?: unknown;
  replicationConfiguration?: unknown;
  defaultServerSideEncryption?: unknown;
}

export interface B2CreateKeyOptions {
  capabilities: B2Capability[];
  keyName: string;
  validDurationInSeconds?: number;
  bucketId?: string | B2Bucket;
  namePrefix?: string;
}

export interface B2DeleteFileVersionOptions {
  bypassGovernance?: boolean;
}

export interface B2ListFileNamesOptions {
  startFileName?: string;
  maxFileCount?: number;
  prefix?: string;
  delimiter?: string;
}

export interface B2ListFileVersionsOptions {
  startFileName?: string;
  maxFileCount?: number;
  prefix?: string;
  delimiter?: string;
}

export interface B2ListKeysOptions {
  startApplicationKeyId?: string;
  maxKeyCount?: number;
}

export interface B2UpdateBucketOptions {
  bucketType?: B2BucketType;
  bucketInfo?: { [key: string]: string };
  corsRules?: unknown;
  fileLockEnabled?: boolean;
  lifecycleRules?: unknown;
  replicationConfiguration?: unknown;
  defaultServerSideEncryption?: unknown;
  ifRevisionIs?: number;
  defaultRetention?: unknown;
}

export interface B2UploadFileOptions {
  contentType?: string;
  lastModified?: Date | number;
  headers?: {
    'Content-Disposition'?: string;
    'Content-Language'?: string;
    'Content-Encoding'?: string;
    Expires?: string;
    'Cache-Control'?: string;
  } & { [key: string]: string };
  /** Contact b2 support to enable this feature */
  customUploadTimestamp?: Date | number;
  legalHold?: boolean;
  retention?: {
    mode: 'compliance' | 'governance';
    retainUntilDate: Date | number;
  };
  // TODO: serverSideEncryption
}

type FileSource = string | Uint8Array | ArrayBuffer | { arrayBuffer(): Promise<ArrayBuffer> };

// Error

export interface B2ErrorData {
  status: number;
  code: string;
  message: string;
}

export class B2Error extends Error {
  status: number;
  code: string;

  constructor(readonly response: B2ErrorData) {
    super(response.message);
    this.status = response.status;
    this.code = response.code;
  }
}
