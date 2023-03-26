let defaultKey: string | undefined;
let defaultOrg: string | undefined;
let hasSetDefaults = false;

export function setAPIKey(key: string | undefined | null) {
  defaultKey = key ?? undefined;
}

export function setOrganization(organization: string | undefined | null) {
  defaultOrg = organization ?? undefined;
}

export interface AuthOverride {
  apiKey?: string;
  organization?: string;
}

export function getAuthHeaders(override?: AuthOverride) {
  if (!hasSetDefaults) {
    defaultKey ??=
      typeof process !== 'undefined' ? process?.env?.OPENAI_API_KEY || undefined : undefined;
    defaultOrg ??=
      typeof process !== 'undefined' ? process?.env?.OPENAI_ORGANIZATION || undefined : undefined;
    hasSetDefaults = true;
  }

  const key = override?.apiKey ?? defaultKey;
  const org = override?.apiKey ?? defaultKey;

  if (!key) {
    throw new Error(
      'OpenAI API KEY not specified. Please set the environment variable OPENAI_API_KEY or call `setAPIKey` with your token. You can create an API key at https://platform.openai.com/account/api-keys'
    );
  }

  return {
    Authorization: `Bearer ${key}`,
    'OpenAI-Organization': org,
  } as Record<string, string>;
}
