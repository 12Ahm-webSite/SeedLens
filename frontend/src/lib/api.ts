import type { AnalyzeSuccessResponse } from '@/types/seedlens';

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
