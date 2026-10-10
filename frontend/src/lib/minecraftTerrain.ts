/**
 * Minecraft Terrain & Biome Procedural Engine for SeedLens
 * Simulates Minecraft 1.20+ Multi-Noise Climate Generation:
 * - Continentalness (Ocean vs Coast vs Land)
 * - Erosion (Flat plains vs Mountains)
 * - Temperature (Frozen vs Temperate vs Arid)
 * - Humidity (Dry vs Humid)
 * - Peaks & Valleys / Weirdness (Mountain ridges, Cherry Groves, Rivers)
 * - 3D Directional Hillshading (Relief elevation shading)
 */

export interface BiomeDefinition {
  id: string;
  nameEn: string;
  nameAr: string;
  icon: string;
  color: [number, number, number]; // [r, g, b]
  category: 'aquatic' | 'temperate' | 'arid' | 'mountain' | 'cold' | 'lush';
  descriptionAr: string;
}

export const BIOMES: Record<string, BiomeDefinition> = {
  deep_ocean: {
    id: 'deep_ocean',
    nameEn: 'Deep Ocean',
    nameAr: 'محيط عميق',
    icon: '🌊',
    color: [16, 32, 98],
    category: 'aquatic',
    descriptionAr: 'مياه بحرية عميقة سحيقة تحتضن خنادق وهياكل غارقة',
  },
  ocean: {
    id: 'ocean',
    nameEn: 'Ocean',
    nameAr: 'محيط',
    icon: '🌊',
    color: [28, 64, 142],
    category: 'aquatic',
    descriptionAr: 'مياه محيطية متوسطة العمق مع كتل مرجانية وشواطئ ممتدة',
  },
  warm_ocean: {
    id: 'warm_ocean',
    nameEn: 'Warm Ocean',
    nameAr: 'محيط دافئ',
    icon: '🐠',
    color: [36, 128, 178],
    category: 'aquatic',
    descriptionAr: 'مياه استوائية فيروزية تحتضن شعاباً مرجانية ملونة',
  },
  frozen_ocean: {
    id: 'frozen_ocean',
    nameEn: 'Frozen Ocean',
    nameAr: 'محيط متجمد',
    icon: '🧊',
    color: [68, 108, 164],
    category: 'cold',
    descriptionAr: 'كتل جليدية عائمة ومياه قطبية قاسية',
  },
  beach: {
    id: 'beach',
    nameEn: 'Beach',
    nameAr: 'شاطئ رملي',
    icon: '🏖️',
    color: [238, 218, 138],
    category: 'aquatic',
    descriptionAr: 'شريط رملي ذهبي يفصل بين اليابسة ومياه المحيط',
  },
  stony_shore: {
    id: 'stony_shore',
    nameEn: 'Stony Shore',
    nameAr: 'ساحل صخري',
    icon: '🪨',
    color: [142, 144, 148],
    category: 'mountain',
    descriptionAr: 'منحدرات حجرية حادة تلتقي بأمواج البحر',
  },
  river: {
    id: 'river',
    nameEn: 'River',
    nameAr: 'نهر',
    icon: '💧',
    color: [28, 80, 186],
    category: 'aquatic',
    descriptionAr: 'مجرى مائي عذب يلتف بين السهول والمرتفعات',
  },
  plains: {
    id: 'plains',
    nameEn: 'Plains',
    nameAr: 'سهول',
    icon: '🌾',
    color: [124, 188, 64],
    category: 'temperate',
    descriptionAr: 'أراضٍ عشبية مفتوحة ومثالية للقرى والزراعة والبناء',
  },
  sunflower_plains: {
    id: 'sunflower_plains',
    nameEn: 'Sunflower Plains',
    nameAr: 'سهول دوار الشمس',
    icon: '🌻',
    color: [144, 208, 76],
    category: 'temperate',
    descriptionAr: 'سهول خضراء مشرقة مكسوة بزهور دوار الشمس الصفراء',
  },
  forest: {
    id: 'forest',
    nameEn: 'Forest',
    nameAr: 'غابة بلوط',
    icon: '🌳',
    color: [44, 108, 30],
    category: 'temperate',
    descriptionAr: 'غابة كثيفة من أشجار البلوط والبتولا الغنية بالأخشاب',
  },
  dark_forest: {
    id: 'dark_forest',
    nameEn: 'Dark Forest',
    nameAr: 'غابة مظلمة',
    icon: '🌲',
    color: [22, 66, 16],
    category: 'temperate',
    descriptionAr: 'غطاء شجري كثيف جداً يحجب ضوء الشمس وموطن قصور الغابة',
  },
  birch_forest: {
    id: 'birch_forest',
    nameEn: 'Birch Forest',
    nameAr: 'غابة البتولا',
    icon: '🌱',
    color: [108, 172, 68],
    category: 'temperate',
    descriptionAr: 'غابة هادئة تتميز بجذوع بيضاء وأوراق شجر خفيفة',
  },
  desert: {
    id: 'desert',
    nameEn: 'Desert',
    nameAr: 'صحراء',
    icon: '🏜️',
    color: [226, 194, 110],
    category: 'arid',
    descriptionAr: 'كثبان رملية شاسعة وقاحلة تضم الأهرامات والقرى الصحراوية',
  },
  badlands: {
    id: 'badlands',
    nameEn: 'Badlands',
    nameAr: 'أراضٍ وعرة (باد لاندز)',
    icon: '🧱',
    color: [186, 90, 42],
    category: 'arid',
    descriptionAr: 'جبال وهضاب مكسوة بطبقات الطين المحروق الغنية بالذهب',
  },
  savanna: {
    id: 'savanna',
    nameEn: 'Savanna',
    nameAr: 'سافانا',
    icon: '🦁',
    color: [166, 154, 70],
    category: 'arid',
    descriptionAr: 'مروج شبه جافة مع أشجار السنط المتفرقة والخيول',
  },
  jungle: {
    id: 'jungle',
    nameEn: 'Jungle',
    nameAr: 'أدغال استوائية',
    icon: '🌴',
    color: [34, 130, 22],
    category: 'lush',
    descriptionAr: 'أشجار عملاقة متشابكة مع نباتات متسلقة وببغاوات ومعابد',
  },
  swamp: {
    id: 'swamp',
    nameEn: 'Swamp',
    nameAr: 'مستنقع',
    icon: '🐸',
    color: [60, 100, 70],
    category: 'lush',
    descriptionAr: 'مياه ضحلة مغطاة بنباتات الزنبق وأشجار مغمورة وأكواخ ساحرات',
  },
  cherry_grove: {
    id: 'cherry_grove',
    nameEn: 'Cherry Grove',
    nameAr: 'بساتين الكرز (ساكورا)',
    icon: '🌸',
    color: [248, 178, 214],
    category: 'mountain',
    descriptionAr: 'منحدرات جبلية خلابة تغطيها أزهار الكرز الوردية وبتلاتها المتطايرة',
  },
  meadow: {
    id: 'meadow',
    nameEn: 'Meadow',
    nameAr: 'مرج جبلي',
    icon: '🌼',
    color: [98, 192, 78],
    category: 'mountain',
    descriptionAr: 'سفوح جبلية خضراء تفيض بالأزهار البرية وأشجار البتولا الانعزالية',
  },
  snowy_slopes: {
    id: 'snowy_slopes',
    nameEn: 'Snowy Slopes',
    nameAr: 'منحدرات جليدية ثلجية',
    icon: '❄️',
    color: [232, 238, 242],
    category: 'cold',
    descriptionAr: 'سفوح ثلجية متجمدة تقود إلى أعلى القمم الجبلية الوعرة',
  },
  jagged_peaks: {
    id: 'jagged_peaks',
    nameEn: 'Jagged Peaks',
    nameAr: 'قمم مسننة',
    icon: '🏔️',
    color: [255, 255, 255],
    category: 'cold',
    descriptionAr: 'أعلى القمم الحادة في العالم مكسوة بالثلوج الدائمة والجليد الصلب',
  },
  stony_peaks: {
    id: 'stony_peaks',
    nameEn: 'Stony Peaks',
    nameAr: 'قمم صخرية',
    icon: '⛰️',
    color: [136, 138, 142],
    category: 'mountain',
    descriptionAr: 'قمم حجرية جرداء من الحجر الكلسي والجرانيت تشرف على الوديان',
  },
  taiga: {
    id: 'taiga',
    nameEn: 'Taiga',
    nameAr: 'تايغا صنوبرية',
    icon: '🌲',
    color: [48, 98, 76],
    category: 'cold',
    descriptionAr: 'غابات صنوبرية باردة موطن للذئاب والتوت الحلو',
  },
  snowy_plains: {
    id: 'snowy_plains',
    nameEn: 'Snowy Plains',
    nameAr: 'سهول ثلجية',
    icon: '🌨️',
    color: [240, 246, 248],
    category: 'cold',
    descriptionAr: 'أراضٍ بيضاء منبسطة يغطيها الجليد والبرد القارس',
  },
};

/**
 * 2D Simplex Noise Implementation (Deterministic via Seed)
 */
class SimplexNoise2D {
  private perm = new Uint8Array(512);
  private permMod12 = new Uint8Array(512);

  private static readonly grad3 = new Float32Array([
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
    1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
    0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
  ]);

  private static readonly F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  private static readonly G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

  constructor(seed: number) {
    let a = seed >>> 0;
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;

    // Fisher-Yates shuffle with simple LCG
    for (let i = 255; i > 0; i--) {
      a = (Math.imul(a, 1664525) + 1013904223) >>> 0;
      const j = a % (i + 1);
      const tmp = p[i];
      p[i] = p[j];
      p[j] = tmp;
    }

    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  public sample(xin: number, yin: number): number {
    let n0 = 0;
    let n1 = 0;
    let n2 = 0;

    const s = (xin + yin) * SimplexNoise2D.F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * SimplexNoise2D.G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    let i1 = 0;
    let j1 = 0;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }

    const x1 = x0 - i1 + SimplexNoise2D.G2;
    const y1 = y0 - j1 + SimplexNoise2D.G2;
    const x2 = x0 - 1.0 + 2.0 * SimplexNoise2D.G2;
    const y2 = y0 - 1.0 + 2.0 * SimplexNoise2D.G2;

    const ii = i & 255;
    const jj = j & 255;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      const gi0 = this.permMod12[ii + this.perm[jj]] * 3;
      t0 *= t0;
      n0 = t0 * t0 * (SimplexNoise2D.grad3[gi0] * x0 + SimplexNoise2D.grad3[gi0 + 1] * y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]] * 3;
      t1 *= t1;
      n1 = t1 * t1 * (SimplexNoise2D.grad3[gi1] * x1 + SimplexNoise2D.grad3[gi1 + 1] * y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]] * 3;
      t2 *= t2;
      n2 = t2 * t2 * (SimplexNoise2D.grad3[gi2] * x2 + SimplexNoise2D.grad3[gi2 + 1] * y2);
    }

    return 70.0 * (n0 + n1 + n2);
  }

  public octaves(x: number, y: number, octs: number, persistence = 0.5, lacunarity = 2.0): number {
    let total = 0;
    let frequency = 1.0;
    let amplitude = 1.0;
    let maxValue = 0;

    for (let i = 0; i < octs; i++) {
      total += this.sample(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return total / maxValue;
  }
}

/**
 * Hash string or number seed into 32-bit integer
 */
function hashSeedToUint32(seedVal: string | number): number {
  const str = String(seedVal);
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export interface TerrainPoint {
  biome: BiomeDefinition;
  height: number; // In Minecraft Y blocks (e.g. 30 to 220)
  hillshade: number; // 0.4 to 1.35
  color: [number, number, number];
  isWater: boolean;
  continentalness: number;
  temperature: number;
  humidity: number;
}

/**
 * Complete Minecraft Java Terrain & Multi-Noise Generator
 */
export class MinecraftTerrainEngine {
  private noiseC: SimplexNoise2D; // Continentalness
  private noiseE: SimplexNoise2D; // Erosion
  private noiseT: SimplexNoise2D; // Temperature
  private noiseH: SimplexNoise2D; // Humidity
  private noisePV: SimplexNoise2D; // Peaks & Valleys / Weirdness
  private noiseR: SimplexNoise2D; // River channels

  constructor(seed: string | number) {
    const baseHash = hashSeedToUint32(seed);
    this.noiseC = new SimplexNoise2D(baseHash ^ 0xa4f2913e);
    this.noiseE = new SimplexNoise2D(baseHash ^ 0x51c78491);
    this.noiseT = new SimplexNoise2D(baseHash ^ 0x3bb84e12);
    this.noiseH = new SimplexNoise2D(baseHash ^ 0x937c220f);
    this.noisePV = new SimplexNoise2D(baseHash ^ 0xe294bb81);
    this.noiseR = new SimplexNoise2D(baseHash ^ 0x1128fa60);
  }

  /**
   * Sample multi-noise climate variables at Minecraft (x, z)
   */
  public sampleClimate(x: number, z: number) {
    // Continentalness: large scale oceans vs continents (~1600 blocks)
    const C = this.noiseC.octaves(x / 1800, z / 1800, 3, 0.45);

    // Erosion: flat valleys vs jagged peaks (~800 blocks)
    const E = this.noiseE.octaves(x / 950, z / 950, 3, 0.5);

    // Temperature: broad climate bands (~2200 blocks)
    const T = this.noiseT.octaves(x / 2400, z / 2400, 3, 0.5);

    // Humidity: moisture variation (~1900 blocks)
    const H = this.noiseH.octaves(x / 2000, z / 2000, 3, 0.5);

    // Peaks & Valleys: ridges and mountain spires (~600 blocks)
    const PV = this.noisePV.octaves(x / 650, z / 650, 4, 0.55);

    // River noise: narrow zero-crossings carving through land (~450 blocks)
    const rawR = this.noiseR.sample(x / 480, z / 480);
    const R = Math.abs(rawR);

    return { C, E, T, H, PV, R };
  }

  /**
   * Calculate terrain height in Minecraft Y coordinates (water level = 62)
   */
  public getHeight(x: number, z: number): number {
    const { C, E, PV, R } = this.sampleClimate(x, z);

    // Sea level is 62 in Minecraft Java
    if (C < -0.15) {
      // Ocean bathymetry: depth from 30 up to 62
      return 62 + C * 70;
    }

    // Base land elevation
    let h = 63 + (C + 0.15) * 35;

    // Mountain elevation based on Peaks & Valleys and low erosion
    if (PV > 0.15) {
      const peakStrength = (PV - 0.15) * 1.3;
      const erosionMod = Math.max(0.2, 1.0 - (E + 0.5) * 0.6);
      h += peakStrength * erosionMod * 110;
    }

    // River carving
    if (R < 0.05 && C > -0.12 && E > -0.3) {
      const riverDepth = (1.0 - R / 0.05) * 16;
      h = Math.max(58, h - riverDepth);
    }

    return h;
  }

  /**
   * Sample complete terrain state at block (x, z)
   */
  public sampleTerrain(x: number, z: number): TerrainPoint {
    const { C, E, T, H, PV, R } = this.sampleClimate(x, z);
    const h = this.getHeight(x, z);
    const isWater = h <= 62;

    let biome: BiomeDefinition;

    if (C < -0.16) {
      // Ocean Zones
      if (C < -0.38) {
        biome = BIOMES.deep_ocean;
      } else if (T < -0.4) {
        biome = BIOMES.frozen_ocean;
      } else if (T > 0.35) {
        biome = BIOMES.warm_ocean;
      } else {
        biome = BIOMES.ocean;
      }
    } else if (C >= -0.16 && C < -0.08 && h <= 66) {
      // Coastal transition & Beaches
      if (E < -0.35) {
        biome = BIOMES.stony_shore;
      } else {
        biome = BIOMES.beach;
      }
    } else if (R < 0.045 && C > -0.09 && E > -0.25) {
      // River carving through land
      biome = BIOMES.river;
    } else if (h > 125) {
      // Mountain High Altitudes
      if (T < -0.3) {
        biome = h > 165 ? BIOMES.jagged_peaks : BIOMES.snowy_slopes;
      } else if (T >= -0.3 && T <= 0.3) {
        // Temperate Mountain Altitudes
        if (H > 0.05 && h >= 115 && h <= 170) {
          // Signature Cherry Blossom Grove!
          biome = BIOMES.cherry_grove;
        } else if (h > 170) {
          biome = BIOMES.stony_peaks;
        } else {
          biome = BIOMES.meadow;
        }
      } else {
        // Warm / Arid Mountain
        biome = BIOMES.stony_peaks;
      }
    } else if (h > 95 && (T >= -0.2 && T <= 0.25) && H > 0.0) {
      // Sub-alpine Meadow / Cherry Grove slopes
      if (H > 0.2 && PV > 0.22) {
        biome = BIOMES.cherry_grove;
      } else {
        biome = BIOMES.meadow;
      }
    } else {
      // Continental Lowlands & Mid-altitudes
      if (T < -0.35) {
        biome = H < -0.1 ? BIOMES.snowy_plains : BIOMES.taiga;
      } else if (T >= -0.35 && T < -0.1) {
        biome = BIOMES.taiga;
      } else if (T >= -0.1 && T <= 0.3) {
        // Temperate Core
        if (H < -0.2) {
          biome = BIOMES.plains;
        } else if (H >= -0.2 && H < 0.15) {
          biome = PV > 0.15 ? BIOMES.birch_forest : BIOMES.plains;
        } else if (H >= 0.15 && H < 0.45) {
          biome = BIOMES.forest;
        } else {
          biome = E > 0.2 ? BIOMES.swamp : BIOMES.dark_forest;
        }
      } else if (T > 0.3 && T <= 0.55) {
        // Warm & Savanna
        if (H < -0.1) {
          biome = BIOMES.savanna;
        } else if (H >= -0.1 && H <= 0.3) {
          biome = BIOMES.plains;
        } else {
          biome = BIOMES.jungle;
        }
      } else {
        // Hot Arid (Desert & Badlands)
        if (H < 0.1) {
          biome = E < -0.08 ? BIOMES.badlands : BIOMES.desert;
        } else {
          biome = BIOMES.jungle;
        }
      }
    }

    // 3D Directional Hillshading (Standard Cartographic Shading from North-West)
    const step = 24;
    const hL = this.getHeight(x - step, z);
    const hR = this.getHeight(x + step, z);
    const hU = this.getHeight(x, z - step);
    const hD = this.getHeight(x, z + step);

    const dx = (hR - hL) / (2 * step);
    const dz = (hD - hU) / (2 * step);

    // Light vector from North-West (x = -0.577, z = -0.577, y = 0.577)
    const invLen = 1.0 / Math.sqrt(dx * dx + dz * dz + 1.0);
    const nx = -dx * invLen;
    const nz = -dz * invLen;
    const ny = 1.0 * invLen;

    const lx = -0.577;
    const lz = -0.577;
    const ly = 0.577;

    const dot = nx * lx + nz * lz + ny * ly;
    let hillshade = 0.65 + 0.55 * dot;
    hillshade = Math.max(0.48, Math.min(1.38, hillshade));

    // Water smoothing
    if (isWater) {
      hillshade = 0.85 + (h / 62) * 0.15;
    }

    // Apply hillshading to RGB
    const r = Math.min(255, Math.max(0, Math.round(biome.color[0] * hillshade)));
    const g = Math.min(255, Math.max(0, Math.round(biome.color[1] * hillshade)));
    const b = Math.min(255, Math.max(0, Math.round(biome.color[2] * hillshade)));

    return {
      biome,
      height: Math.round(h),
      hillshade,
      color: [r, g, b],
      isWater,
      continentalness: C,
      temperature: T,
      humidity: H,
    };
  }

  /**
   * Render a 256x256 Leaflet tile canvas for Minecraft coordinates
   */
  public renderTile(
    canvas: HTMLCanvasElement,
    tileX: number,
    tileY: number,
    zoom: number
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tileSize = canvas.width; // 256
    const scale = Math.pow(2, zoom);

    // Fast sampling grid: 128x128 grid upscaled to 256x256
    // This provides 60fps rendering speed while matching Minecraft voxel feel!
    const sampleRes = 128;
    const step = tileSize / sampleRes;

    const offscreen = document.createElement('canvas');
    offscreen.width = sampleRes;
    offscreen.height = sampleRes;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    const imgData = offCtx.createImageData(sampleRes, sampleRes);
    const data = imgData.data;

    let ptr = 0;
    for (let sy = 0; sy < sampleRes; sy++) {
      const py = sy * step;
      const mcZ = (tileY * tileSize + py) / scale;

      for (let sx = 0; sx < sampleRes; sx++) {
        const px = sx * step;
        const mcX = (tileX * tileSize + px) / scale;

        const pt = this.sampleTerrain(mcX, mcZ);

        data[ptr] = pt.color[0];
        data[ptr + 1] = pt.color[1];
        data[ptr + 2] = pt.color[2];
        data[ptr + 3] = 255;
        ptr += 4;
      }
    }

    offCtx.putImageData(imgData, 0, 0);

    // Draw upscaled onto canvas with smooth interpolation for clean cartographic look
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(offscreen, 0, 0, sampleRes, sampleRes, 0, 0, tileSize, tileSize);
  }
}
