import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { validateVersion, getVersionFeatures } from '@/lib/validation';
import type {
  WishlistQuery,
  WishlistMatchResult,
  SeedLensResult,
  PlaystylePresetId,
} from '@/types/seedlens';

// Path resolution for the SeedLens CLI binary
function getSeedlensBinaryPath(): string | null {
  const possiblePaths = [
    process.env.SEEDLENS_BIN_PATH,
    path.resolve(process.cwd(), '../seedlens'),
    path.resolve(process.cwd(), 'seedlens'),
  ].filter((p): p is string => Boolean(p));

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
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

// Curated pool of high-diversity, archetypically verified seeds
const SEED_POOL = [
  '2026',
  '202620262026202626',
  '123456789',
  '-1467692750553100038',
  '1844674407370955161',
  '739208174635920481',
  '42',
  '-123456789',
  '-7777777',
  '161803398',
  '777',
  '50000000',
  '-987654321',
  '-42',
  '654321',
  '314159265',
  '271828182',
  '88888',
  '999999',
  '54321',
  '101010',
];

async function runSeedlens(
  binaryPath: string,
  seed: string,
  version: string
): Promise<SeedLensResult | null> {
  return new Promise((resolve) => {
    const child = spawn(binaryPath, [seed, '--version', version], {
      cwd: path.dirname(binaryPath),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.on('close', (code) => {
      if (code === 0 && stdout) {
        try {
          const parsed = JSON.parse(stdout) as SeedLensResult;
          resolve(parsed);
          return;
        } catch {
          // JSON parse failed
        }
      }
      resolve(null);
    });

    child.on('error', () => {
      resolve(null);
    });
  });
}

async function runSeedlensFind(
  binaryPath: string,
  args: string[]
): Promise<WishlistMatchResult | null> {
  return new Promise((resolve) => {
    const child = spawn(binaryPath, ['find', ...args], {
      cwd: path.dirname(binaryPath),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.on('close', (code) => {
      if (code === 0 && stdout) {
        try {
          const parsed = JSON.parse(stdout) as WishlistMatchResult;
          resolve(parsed);
          return;
        } catch {
          // JSON parse failed
        }
      }
      resolve(null);
    });

    child.on('error', () => {
      resolve(null);
    });
  });
}

export async function POST(req: Request) {
  const startTime = Date.now();

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

    const query = (body || {}) as WishlistQuery;
    const versionValidation = validateVersion(query.version || '1.20.6');
    if (!versionValidation.valid) {
      return NextResponse.json(
        { error: versionValidation.error || 'Unsupported Minecraft version.' },
        { status: 400 }
      );
    }
    const version = versionValidation.version;

    const binaryPath = getSeedlensBinaryPath();
    if (!binaryPath) {
      return NextResponse.json(
        { error: 'SeedLens analysis engine binary is currently unavailable.' },
        { status: 500 }
      );
    }

    const features = getVersionFeatures(version);

    // Resolve criteria based on playstyle preset or custom sliders
    let landmarkType = query.landmarkType || 'any';
    let minScenic = query.minScenicScore ?? 0;
    let minBuilding = query.minBuildingScore ?? 0;
    let clusterCategory = query.clusterCategory || 'any';
    let maxDistance = query.maxSpawnDistance ?? 5000;
    const preset = query.playstylePreset;

    if (preset) {
      switch (preset) {
        case 'mega_builder':
          landmarkType = 'prime_building_basin';
          minBuilding = 80;
          maxDistance = Math.min(maxDistance, 2000);
          break;
        case 'dungeon_raider':
          if (features.hasTrialChambers) {
            clusterCategory = 'trial_or_abyssal';
          } else if (features.hasAncientCity) {
            clusterCategory = 'abyssal_hub';
          } else {
            clusterCategory = 'strategic_mega_hub';
          }
          maxDistance = Math.min(maxDistance, 2500);
          break;
        case 'aesthetic_creator':
          if (features.hasCherryGroves) {
            landmarkType = 'cherry_or_crater';
          } else {
            landmarkType = 'peaks_or_cliffs';
          }
          minScenic = 85;
          maxDistance = Math.min(maxDistance, 3500);
          break;
        case 'castaway_survivor':
          landmarkType = 'isolated_island';
          maxDistance = Math.min(maxDistance, 1500);
          break;
        case 'economy_mogul':
          clusterCategory = 'trading_metropolis';
          maxDistance = Math.min(maxDistance, 3000);
          break;
      }
    }

    // Version safety guards for manual queries incompatible with version:
    if (!features.hasCherryGroves && landmarkType === 'cherry_caldera') {
      landmarkType = 'mountain_crater';
    }
    if (!features.hasAncientCity && (clusterCategory === 'abyssal_hub' || clusterCategory === 'trial_or_abyssal')) {
      clusterCategory = 'trading_metropolis';
    }

    // 1. Ultra-fast Phase 3 C Engine search (Fast-Reject Pipeline)
    const findArgs: string[] = ['--version', version];
    if (preset) {
      findArgs.push('--preset', preset);
    }
    if (landmarkType && landmarkType !== 'any') {
      findArgs.push('--landmark', landmarkType);
    }
    if (clusterCategory && clusterCategory !== 'any') {
      findArgs.push('--cluster', clusterCategory);
    }
    if (minScenic > 0) {
      findArgs.push('--min-scenic', String(minScenic));
    }
    if (minBuilding > 0) {
      findArgs.push('--min-building', String(minBuilding));
    }
    if (maxDistance > 0) {
      findArgs.push('--max-dist', String(maxDistance));
    }

    try {
      const cResult = await runSeedlensFind(binaryPath, findArgs);
      if (cResult && cResult.seed) {
        return NextResponse.json(cResult);
      }
    } catch {
      // Continue to fallback pool
    }

    // Prioritize candidates based on the archetype
    const candidateSeeds = [...SEED_POOL];
    if (preset === 'mega_builder' || landmarkType === 'prime_building_basin') {
      candidateSeeds.sort((a) => (['-7777777', '123456789', '654321'].includes(a) ? -1 : 1));
    } else if (preset === 'aesthetic_creator' || landmarkType === 'cherry_caldera') {
      candidateSeeds.sort((a) => (['2026', '50000000', '202620262026202626'].includes(a) ? -1 : 1));
    } else if (preset === 'castaway_survivor' || landmarkType === 'isolated_island') {
      candidateSeeds.sort((a) => (['202620262026202626', '-987654321', '-42'].includes(a) ? -1 : 1));
    } else if (preset === 'dungeon_raider') {
      candidateSeeds.sort((a) => (['123456789', '202620262026202626', '-1467692750553100038'].includes(a) ? -1 : 1));
    } else if (preset === 'economy_mogul' || clusterCategory === 'trading_metropolis') {
      candidateSeeds.sort((a) => (['123456789', '2026', '42'].includes(a) ? -1 : 1));
    }

    let evaluatedCount = 0;
    let bestMatch: {
      seed: string;
      result: SeedLensResult;
      highlight: WishlistMatchResult['highlight'];
      type: 'landmark' | 'cluster' | 'discovery';
      title: string;
      score: number;
    } | null = null;

    for (const seedCandidate of candidateSeeds) {
      evaluatedCount++;
      const res = await runSeedlens(binaryPath, seedCandidate, version);
      if (!res) continue;

      const landmarks = res.landmarks?.spots || [];
      const clusters = res.clusters || [];
      const discovery = res.discovery;

      // 1. Evaluate Landmark Match
      for (const lm of landmarks) {
        let typeMatches = false;
        if (landmarkType === 'any') {
          typeMatches = true;
        } else if (landmarkType === 'cherry_or_crater') {
          typeMatches = ['cherry_caldera', 'cherry_grove', 'mountain_crater'].includes(lm.category);
        } else if (landmarkType === 'peaks_or_cliffs') {
          typeMatches = ['mountain_crater', 'epic_clifftop'].includes(lm.category);
        } else {
          typeMatches = lm.category === landmarkType;
        }

        const scenicPasses = lm.scenic_score >= minScenic;
        const buildingPasses = lm.building_score >= minBuilding;
        const distPasses = lm.distance_to_spawn <= maxDistance;

        if (typeMatches && scenicPasses && buildingPasses && distPasses) {
          const landmarkPriority =
            preset === 'aesthetic_creator' ||
            preset === 'mega_builder' ||
            preset === 'castaway_survivor' ||
            landmarkType !== 'any'
              ? 300
              : 50;
          const matchScore =
            landmarkPriority +
            lm.scenic_score +
            lm.building_score -
            lm.distance_to_spawn / 100;

          if (!bestMatch || matchScore > bestMatch.score) {
            bestMatch = {
              seed: seedCandidate,
              result: res,
              highlight: {
                name: lm.name_ar ? `${lm.name_ar} (${lm.name_en})` : lm.name_en,
                category: lm.category,
                x: lm.x,
                y: lm.y,
                z: lm.z,
                distance: lm.distance_to_spawn,
                scenicScore: lm.scenic_score,
                buildingScore: lm.building_score,
                tpCommand: lm.teleport_command,
                description: lm.description_ar || lm.description_en,
                primaryBiome: lm.primary_biome,
              },
              type: 'landmark',
              title: lm.name_ar || lm.name_en,
              score: matchScore,
            };
          }
        }
      }

      // 2. Evaluate Cluster Match
      for (const cl of clusters) {
        let catMatches = false;
        if (clusterCategory === 'any') {
          catMatches = true;
        } else if (clusterCategory === 'trial_or_abyssal') {
          catMatches = cl.primary_category.toLowerCase().includes('abyssal');
        } else if (clusterCategory === 'trading_metropolis') {
          catMatches = cl.primary_category.toLowerCase().includes('trading');
        } else if (clusterCategory === 'abyssal_hub') {
          catMatches = cl.primary_category.toLowerCase().includes('abyssal');
        } else if (clusterCategory === 'spawn_outpost') {
          catMatches = cl.primary_category.toLowerCase().includes('spawn');
        } else if (clusterCategory === 'strategic_mega_hub') {
          catMatches = cl.primary_category.toLowerCase().includes('strategic');
        }

        const distPasses = cl.cluster.nearest_spawn <= maxDistance;

        if (catMatches && distPasses) {
          const clusterPriority =
            preset === 'economy_mogul' ||
            preset === 'dungeon_raider' ||
            clusterCategory !== 'any'
              ? 300
              : 50;
          const matchScore =
            clusterPriority +
            cl.cluster.count * 10 -
            cl.cluster.nearest_spawn / 100;

          if (!bestMatch || matchScore > bestMatch.score) {
            bestMatch = {
              seed: seedCandidate,
              result: res,
              highlight: {
                name: cl.primary_category,
                category: cl.primary_category,
                x: Math.round(cl.center.x),
                z: Math.round(cl.center.z),
                distance: cl.cluster.nearest_spawn,
                tpCommand: `/tp ${Math.round(cl.center.x)} ~ ${Math.round(cl.center.z)}`,
                description: cl.explanation,
              },
              type: 'cluster',
              title: cl.primary_category,
              score: matchScore,
            };
          }
        }
      }

      // 3. Evaluate Discovered Structures (e.g. Trial Chambers for Dungeon Raider)
      if (clusterCategory === 'trial_or_abyssal' || preset === 'dungeon_raider') {
        const trialChambers = (discovery?.structures || []).filter(
          (s) => s.type === 'Trial Chambers' && s.distance_to_spawn <= maxDistance
        );
        trialChambers.sort((a, b) => a.distance_to_spawn - b.distance_to_spawn);
        if (trialChambers.length > 0) {
          const tc = trialChambers[0];
          const matchScore = 380 - tc.distance_to_spawn / 100;
          if (!bestMatch || matchScore > bestMatch.score) {
            bestMatch = {
              seed: seedCandidate,
              result: res,
              highlight: {
                name: 'غرف المحاكمة النحاسية (Trial Chambers)',
                category: 'Trial Chambers',
                x: tc.x,
                z: tc.z,
                distance: tc.distance_to_spawn,
                tpCommand: `/tp ${tc.x} ~ ${tc.z}`,
                description:
                  'غرف محاكمة نحاسية غنية بوحوش الـ Breeze والصولجان وصناديق الغنائم الملحمية على مقربة من نقطة البداية.',
              },
              type: 'discovery',
              title: 'غرف المحاكمة النحاسية',
              score: matchScore,
            };
          }
        }
      }

      // If we found a great match in early seeds, stop early to optimize response time
      if (bestMatch && evaluatedCount >= 3) {
        break;
      }
    }

    // Fallback if strict criteria yielded no match: pick top candidate from pool
    if (!bestMatch && candidateSeeds.length > 0) {
      const fallbackSeed = candidateSeeds[0];
      const res = await runSeedlens(binaryPath, fallbackSeed, version);
      if (res) {
        const lm = res.landmarks?.spots?.[0];
        const cl = res.clusters?.[0];
        if (lm) {
          bestMatch = {
            seed: fallbackSeed,
            result: res,
            highlight: {
              name: lm.name_ar ? `${lm.name_ar} (${lm.name_en})` : lm.name_en,
              category: lm.category,
              x: lm.x,
              y: lm.y,
              z: lm.z,
              distance: lm.distance_to_spawn,
              scenicScore: lm.scenic_score,
              buildingScore: lm.building_score,
              tpCommand: lm.teleport_command,
              description: lm.description_ar || lm.description_en,
              primaryBiome: lm.primary_biome,
            },
            type: 'landmark',
            title: lm.name_ar || lm.name_en,
            score: 50,
          };
        } else if (cl) {
          bestMatch = {
            seed: fallbackSeed,
            result: res,
            highlight: {
              name: cl.primary_category,
              category: cl.primary_category,
              x: Math.round(cl.center.x),
              z: Math.round(cl.center.z),
              distance: cl.cluster.nearest_spawn,
              tpCommand: `/tp ${Math.round(cl.center.x)} ~ ${Math.round(cl.center.z)}`,
              description: cl.explanation,
            },
            type: 'cluster',
            title: cl.primary_category,
            score: 50,
          };
        }
      }
    }

    if (!bestMatch) {
      return NextResponse.json(
        { error: 'No matching seed found for the provided criteria.' },
        { status: 404 }
      );
    }

    const searchTimeMs = Date.now() - startTime;
    const responseData: WishlistMatchResult = {
      seed: bestMatch.seed,
      version,
      matchedPreset: preset as PlaystylePresetId | undefined,
      highlightTitle: bestMatch.title,
      highlightType: bestMatch.type,
      highlight: bestMatch.highlight,
      seedsEvaluatedCount: evaluatedCount,
      searchTimeMs,
    };

    return NextResponse.json(responseData);
  } catch (err: unknown) {
    console.error('[Find-Seed API Error]:', err);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred while finding seeds.' },
      { status: 500 }
    );
  }
}
