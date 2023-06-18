import { fetchOpenAI, FetchOptions } from './fetch';

export type ModerationModel = 'text-moderation-latest' | 'text-moderation-stable';

export type ModerationCategory =
  | 'hate'
  | 'hate/threatening'
  | 'self-harm'
  | 'sexual'
  | 'sexual/minors'
  | 'violence'
  | 'violence/graphic';

export interface ModerationOptions extends FetchOptions {
  model?: ModerationModel;
  input: string;
}

interface RawModeration {
  id: string;
  model: string;
  results: [
    {
      categories: Record<ModerationCategory, boolean>;
      category_scores: Record<ModerationCategory, number>;
      flagged: boolean;
    }
  ];
}

interface ModerationResult {
  model: ModerationModel;
  flagged: boolean;
  categories: Record<ModerationCategory, boolean>;
  categoryScores: Record<ModerationCategory, number>;
}

export async function generateModeration<N extends number>(
  options: ModerationOptions
): Promise<ModerationResult> {
  const { model, input, auth, retry } = options;
  const response = await fetchOpenAI({
    endpoint: '/moderations',
    method: 'POST',
    body: {
      model,
      input,
    },
    auth,
    retry,
  });

  const json = (await response.json()) as RawModeration;

  return {
    model: json.model as ModerationModel,
    flagged: json.results[0].flagged,
    categories: json.results[0].categories,
    categoryScores: json.results[0].category_scores,
  };
}
