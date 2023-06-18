function divideBy1000<T>(obj: T): T {
  for (const key in obj) {
    if (typeof obj[key] === 'number') {
      (obj as any)[key] = (obj as any)[key] / 1000;
    } else if (Array.isArray(obj[key])) {
      (obj as any)[key] = (obj as any)[key].map((v: number) => v / 1000);
    }
  }
  return obj;
}

/** Per token. [input, output] */
export const PRICING_CHAT = divideBy1000({
  'gpt-4': [0.03, 0.06],
  'gpt-4-0613': [0.03, 0.06],
  'gpt-4-32k': [0.06, 0.12],
  'gpt-4-32k-0613': [0.06, 0.12],
  'gpt-3.5-turbo': [0.0015, 0.002],
  'gpt-3.5-turbo-16k': [0.003, 0.004],
  'gpt-3.5-turbo-16k-0613': [0.003, 0.004],
  'gpt-3.5-turbo-0613': [0.0015, 0.002],
  // deprecated
  'gpt-4-0314': [0.03, 0.06],
  'gpt-4-32k-0314': [0.06, 0.12],
  'gpt-3.5-turbo-0301': [0.002, 0.004],
});

export type ChatModel = keyof typeof PRICING_CHAT;

/** Per 1000 tokens. */
export const PRICING_TEXT = divideBy1000({
  'text-davinci-003': 0.02,
  'text-davinci-002': 0.02,
  'text-curie-001': 0.002,
  'text-babbage-001': 0.0005,
  'text-ada-001': 0.0004,
  davinci: 0.02,
  curie: 0.002,
  babbage: 0.0005,
  ada: 0.0004,
});
export type TextModel = keyof typeof PRICING_TEXT;

/** "During this initial beta period, usage of the edits endpoint is free." */
export const PRICING_TEXT_EDIT = {
  'text-davinci-edit-001': 0,
  'code-davinci-edit-001': 0,
};

export type TextEditModel = keyof typeof PRICING_TEXT_EDIT;

/** Per image. */
export const PRICING_IMAGE = {
  1024: 0.02,
  512: 0.018,
  256: 0.016,
};

export type ImageResolution = keyof typeof PRICING_IMAGE;

/** Per Minute. */
export const PRICING_AUDIO = {
  'whisper-1': 0.006,
};

export const PRICING_MODERATION = {
  'text-moderation-latest': 0,
  'text-moderation-stable': 0,
};
