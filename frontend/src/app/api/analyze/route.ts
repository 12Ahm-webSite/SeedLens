import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { validateAndResolveSeed, validateVersion } from '@/lib/validation';
import type { SeedLensResult } from '@/types/seedlens';

// Path resolution for the SeedLens CLI binary
function getSeedlensBinaryPath(): string | null {
  const possiblePaths = [
    // Configurable via environment variable
    process.env.SEEDLENS_BIN_PATH,
    // Standard relative when running Next.js from frontend/
    path.resolve(process.cwd(), '../seedlens'),
    // If run from workspace root
    path.resolve(process.cwd(), 'seedlens'),
  ].filter((p): p is string => Boolean(p));

  for (const p of possiblePaths) {
    if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
      try {
        fs.accessSync(p, fs.constants.X_OK);
        return p;
      } catch {
        // Not executable
      }
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Request body must be a JSON object containing "seed".' },
        { status: 400 }
      );
    }

    const { seed, version } = body as { seed?: unknown; version?: unknown };

    // 1. Validate and resolve the seed
    const seedValidation = validateAndResolveSeed(seed);
    if (!seedValidation.valid || !seedValidation.seedString) {
      return NextResponse.json(
        { error: seedValidation.error || 'Invalid seed provided.' },
        { status: 400 }
      );
    }

    // 2. Validate version
    const versionValidation = validateVersion(version);
    if (!versionValidation.valid) {
      return NextResponse.json(
        { error: versionValidation.error || 'Unsupported Minecraft version.' },
        { status: 400 }
      );
    }

    // 3. Locate CLI binary
    const binaryPath = getSeedlensBinaryPath();
    if (!binaryPath) {
      console.error('[SeedLens API] Binary not found or not executable.');
      return NextResponse.json(
        {
          error:
            'SeedLens analysis engine binary is currently unavailable. Please build the engine binary first.',
        },
        { status: 500 }
      );
    }

    // 4. Execute the binary securely with child_process.spawn
    const args = [seedValidation.seedString, '--version', versionValidation.version];

    const result = await new Promise<{
      stdout: string;
      stderr: string;
      code: number | null;
      signal: NodeJS.Signals | null;
    }>((resolve, reject) => {
      const child = spawn(/*turbopackIgnore: true*/ binaryPath, args, {
        cwd: path.dirname(binaryPath),
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      const timeoutId = setTimeout(() => {
        child.kill('SIGKILL');
        reject(new Error('Analysis timed out after 15 seconds.'));
      }, 15000);

      child.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
      });

      child.on('error', (err) => {
        clearTimeout(timeoutId);
        reject(err);
      });

      child.on('close', (code, signal) => {
        clearTimeout(timeoutId);
        resolve({ stdout, stderr, code, signal });
      });
    });

    if (result.code !== 0) {
      console.error(
        `[SeedLens API] CLI exited with code ${result.code}: ${result.stderr.trim()}`
      );

      // Return clean, user-facing error message based on stderr without internal system paths
      const errLower = result.stderr.toLowerCase();
      if (errLower.includes('unsupported minecraft version')) {
        return NextResponse.json(
          { error: `Unsupported Minecraft version '${versionValidation.version}'.` },
          { status: 400 }
        );
      }
      if (errLower.includes('invalid seed')) {
        return NextResponse.json(
          { error: `The provided seed '${seedValidation.seedString}' is invalid.` },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: 'Analysis engine failed to process the seed.',
          details: 'The engine returned an error during analysis.',
        },
        { status: 500 }
      );
    }

    // 5. Parse JSON output
    let parsedResult: SeedLensResult;
    try {
      parsedResult = JSON.parse(result.stdout);
    } catch (parseErr) {
      console.error('[SeedLens API] Failed to parse engine JSON output:', parseErr);
      return NextResponse.json(
        { error: 'Failed to parse analysis results from engine.' },
        { status: 500 }
      );
    }

    // Return the result with metadata
    return NextResponse.json({
      ...parsedResult,
      raw_input_seed: String(seed ?? ''),
      seed_string: seedValidation.seedString,
      interpreted_from_text: seedValidation.isTextConverted,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    console.error('[SeedLens API] Unexpected error in /api/analyze:', message);

    if (message.includes('timed out')) {
      return NextResponse.json(
        { error: 'Analysis timed out. Please try a different seed.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected internal error occurred during seed analysis.' },
      { status: 500 }
    );
  }
}
