export class AIServiceError extends Error {
  constructor(
    message: string,
    public code: 'no_key' | 'unauthorized' | 'rate_limit' | 'network' | 'unknown' = 'unknown'
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export function mapFetchError(res: Response): AIServiceError {
  if (res.status === 401 || res.status === 403) {
    return new AIServiceError('API key rejected. Check the key in AI Settings.', 'unauthorized');
  }
  if (res.status === 429) {
    return new AIServiceError('Rate limited by the provider. Try again in a minute.', 'rate_limit');
  }
  return new AIServiceError(`Provider error (${res.status}).`, 'unknown');
}

export function humanizeAIError(err: unknown): string {
  if (err instanceof AIServiceError) return err.message;
  if (err instanceof TypeError) {
    return 'Network error — check your connection or try again.';
  }
  if (err instanceof Error) return err.message;
  return 'AI request failed. Falling back to rule-based suggestions.';
}
