export interface SearchBounds {
  min_x: number;
  max_x: number;
  min_z: number;
  max_z: number;
}

export interface Summary {
  total_clusters: number;
  useful_clusters: number;
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

export interface SeedLensResult {
  schema_version?: number;
  seed: number | string;
  seed_string?: string;
  minecraft_version: string;
  world_spawn?: WorldSpawn;
  search: SearchBounds;
  summary: Summary;
  clusters: Cluster[];
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
