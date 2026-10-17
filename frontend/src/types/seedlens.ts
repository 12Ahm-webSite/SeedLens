export interface SearchBounds {
  min_x: number;
  max_x: number;
  min_z: number;
  max_z: number;
}

export interface Summary {
  total_candidates?: number;
  total_clusters: number;
  useful_clusters: number;
  clusters_truncated?: boolean;
}

export interface ClusterCenter {
  x: number;
  z: number;
}

export interface ClusterMetrics {
  count: number;
  type_count: number;
  diameter: number;
  closest_pair: number;
  nearest_spawn: number;
  nearest_origin?: number;
  density: number;
}

export interface StructureSummary {
  type: string;
  count: number;
}

export type ViabilityStatus = 'terrain_validated' | 'terrain_unlikely' | 'biome_viable';

export interface Structure {
  type: string;
  x: number;
  z: number;
  distance_to_spawn: number;
  distance_to_origin?: number;
  viability_status?: ViabilityStatus;
}

export interface Cluster {
  id: number;
  primary_category: string;
  categories: string[];
  center: ClusterCenter;
  cluster: ClusterMetrics;
  structures_summary: StructureSummary[];
  structures: Structure[];
  explanation: string;
}

export interface WorldSpawn {
  x: number;
  z: number;
}

export interface DiscoveredStructure {
  type: string;
  x: number;
  z: number;
  distance_to_spawn: number;
  distance_to_origin?: number;
  viability_status?: ViabilityStatus;
}

export interface DiscoverySummary {
  total_discovered: number;
  by_type: Record<string, number>;
  structures: DiscoveredStructure[];
}

export interface LandmarkSpot {
  id: number;
  category:
    | 'cherry_caldera'
    | 'cherry_grove'
    | 'mountain_crater'
    | 'epic_clifftop'
    | 'prime_building_basin'
    | 'isolated_island'
    | 'pale_garden'
    | string;
  name_ar: string;
  name_en: string;
  x: number;
  y: number;
  z: number;
  distance_to_spawn: number;
  primary_biome: string;
  surrounding_biomes: string[];
  scenic_score: number;
  building_score: number;
  tags: string[];
  teleport_command: string;
  description_ar: string;
  description_en: string;
}

export interface LandmarksSummary {
  total_found: number;
  spot_count: number;
  spots: LandmarkSpot[];
}

export interface SeedLensResult {
  schema_version?: number;
  seed: number | string;
  seed_string?: string;
  minecraft_version: string;
  world_spawn?: WorldSpawn;
  search: SearchBounds;
  summary: Summary;
  clusters: Cluster[];
  discovery?: DiscoverySummary;
  landmarks?: LandmarksSummary;
  interpreted_seed?: string;
}

export interface AnalyzeRequest {
  seed: string;
  version?: string;
}

export interface AnalyzeSuccessResponse extends SeedLensResult {
  raw_input_seed: string;
  seed_string: string;
  interpreted_from_text?: boolean;
}

export interface AnalyzeErrorResponse {
  error: string;
  details?: string;
}

export type CategoryName =
  | 'Strategic Mega-Hub'
  | 'Trading Metropolis'
  | 'Abyssal Hub'
  | 'Spawn Outpost'
  | 'Dense Multi'
  | string;
