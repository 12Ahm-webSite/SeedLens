import type {
  AnalyzeSuccessResponse,
  WishlistQuery,
  WishlistMatchResult,
} from '@/types/seedlens';

export interface AnalyzeSeedParams {
  seed: string;
  version?: string;
}

export async function analyzeSeed({
  seed,
  version = '1.20.6',
}: AnalyzeSeedParams): Promise<AnalyzeSuccessResponse> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      seed,
      version,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error || 'Failed to analyze seed. Please try again.';
    throw new Error(errorMessage);
  }

  return data as AnalyzeSuccessResponse;
}

export async function findDreamSeed(
  query: WishlistQuery
): Promise<WishlistMatchResult> {
  const response = await fetch('/api/find-seed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data?.error || 'Failed to discover matching seed. Please adjust criteria.';
    throw new Error(errorMessage);
  }

  return data as WishlistMatchResult;
}
