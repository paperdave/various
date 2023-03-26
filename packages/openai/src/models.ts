export const PRICING_CHAT = {
  'gpt-4': 0.03 / 1000,
  'gpt-4-0314': 0.03 / 1000,
  'gpt-4-32k': 0.06 / 1000,
  'gpt-4-32k-0314': 0.06 / 1000,
  'gpt-3.5-turbo': 0.002 / 1000,
  'gpt-3.5-turbo-0301': 0.002 / 1000,
};

export type ChatModel = keyof typeof PRICING_CHAT;

export const PRICING_TEXT = {
  'text-davinci-003': 0.02 / 1000,
  'text-davinci-002': 0.02 / 1000,
  'text-curie-001': 0.002 / 1000,
  'text-babbage-001': 0.0005 / 1000,
  'text-ada-001': 0.0004 / 1000,
  davinci: 0.02 / 1000,
  curie: 0.002 / 1000,
  babbage: 0.0005 / 1000,
  ada: 0.0004 / 1000,
};

export type TextModel = keyof typeof PRICING_TEXT;

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
