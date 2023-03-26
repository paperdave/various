let apiKey: string | undefined =
  typeof process !== 'undefined' ? process?.env?.OPENAI_API_KEY || undefined : undefined;

export function setAPIKey(key: string | undefined) {
  apiKey = key;
}

export function getAPIKey() {
  if (!apiKey) {
    throw new Error(
      'OpenAI API KEY not specified. Please set the environment variable OPENAI_API_KEY or call `setAPIKey` with your token. You can create an API key at https://platform.openai.com/account/api-keys'
    );
  }
  return apiKey;
}
