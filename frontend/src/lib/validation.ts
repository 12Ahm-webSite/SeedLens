export const SUPPORTED_VERSIONS = [
  '1.18.2',
  '1.19.4',
  '1.20.6',
  '1.21.1',
  '1.21.3',
  '1.21.4',
  '26.3',
] as const;
export type SupportedVersion = (typeof SUPPORTED_VERSIONS)[number];
export const DEFAULT_VERSION: SupportedVersion = '1.20.6';

const MIN_INT64 = BigInt('-9223372036854775808');
const MAX_INT64 = BigInt('9223372036854775807');

/**
 * Standard Java String.hashCode() implementation.
 * Minecraft Java Edition uses this to convert non-numeric text seeds into 32-bit signed integers.
 */
export function javaStringHashCode(str: string): bigint {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (Math.imul(31, hash) + char) | 0;
  }
  return BigInt(hash);
}

export interface SeedValidationResult {
  valid: boolean;
  seedString?: string;
  error?: string;
  errorCode?: 'EMPTY' | 'OUT_OF_RANGE' | 'INVALID_PARSE' | 'INVALID_TYPE';
  isTextConverted?: boolean;
  originalInput?: string;
}

export function validateAndResolveSeed(input: unknown): SeedValidationResult {
  if (typeof input !== 'string' && typeof input !== 'number') {
    return {
      valid: false,
      error: 'Invalid seed input. Please provide a numeric or text seed.',
    };
  }

  const trimmed = String(input).trim();

  if (!trimmed) {
    return {
      valid: false,
      error: 'Seed cannot be empty. Please enter a seed number or text.',
    };
  }

  // Check if it's a numeric integer (positive or negative)
  if (/^-?\d+$/.test(trimmed)) {
    try {
      const big = BigInt(trimmed);
      if (big < MIN_INT64 || big > MAX_INT64) {
        return {
          valid: false,
          errorCode: 'OUT_OF_RANGE',
          error:
            'Seed value is out of 64-bit integer range (-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807).',
        };
      }
      return {
        valid: true,
        seedString: trimmed,
        isTextConverted: false,
        originalInput: trimmed,
      };
    } catch {
      return {
        valid: false,
        error: 'Failed to parse integer seed.',
      };
    }
  }

  // If input contains letters or characters, convert using Minecraft Java text seed hashing
  const textHash = javaStringHashCode(trimmed);
  return {
    valid: true,
    seedString: textHash.toString(),
    isTextConverted: true,
    originalInput: trimmed,
  };
}

export function validateVersion(version: unknown): {
  valid: boolean;
  version: string;
  error?: string;
} {
  if (!version) {
    return { valid: true, version: DEFAULT_VERSION };
  }

  if (typeof version !== 'string') {
    return {
      valid: false,
      version: DEFAULT_VERSION,
      error: 'Version must be a string.',
    };
  }

  const trimmedVersion = version.trim();

  // Check canonical supported versions
  if (SUPPORTED_VERSIONS.includes(trimmedVersion as SupportedVersion)) {
    return { valid: true, version: trimmedVersion };
  }

  // Support common aliases
  if (trimmedVersion === '1.18') {
    return { valid: true, version: '1.18.2' };
  }
  if (trimmedVersion === '1.19' || trimmedVersion === '1.19.2') {
    return { valid: true, version: '1.19.4' };
  }
  if (trimmedVersion === '1.20') {
    return { valid: true, version: '1.20.6' };
  }
  if (trimmedVersion === '1.21') {
    return { valid: true, version: '1.21.1' };
  }
  if (
    trimmedVersion === '1.21-wd' ||
    trimmedVersion === 'winter-drop' ||
    trimmedVersion === '26.3' ||
    trimmedVersion === '26.x' ||
    trimmedVersion === 'latest'
  ) {
    return { valid: true, version: '1.21.4' };
  }

  return {
    valid: false,
    version: trimmedVersion,
    error: `Unsupported Minecraft version '${trimmedVersion}'. Currently supported: ${SUPPORTED_VERSIONS.join(', ')}`,
  };
}

export interface VersionFeatures {
  hasAncientCity: boolean;
  hasCherryGroves: boolean;
  hasTrailRuins: boolean;
  hasTrialChambers: boolean;
  hasPaleGarden: boolean;
}

export function getVersionFeatures(version: string): VersionFeatures {
  const v = validateVersion(version).version;
  const is118 = v.startsWith('1.18');
  const is119 = v.startsWith('1.19');
  const is120 = v.startsWith('1.20');
  const is121 = v.startsWith('1.21');
  const is26 = v.startsWith('26') || v === '1.21.4';

  return {
    hasAncientCity: !is118,
    hasCherryGroves: !is118 && !is119,
    hasTrailRuins: !is118 && !is119,
    hasTrialChambers: is121 || is26,
    hasPaleGarden: is26,
  };
}
