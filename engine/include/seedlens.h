#ifndef SEEDLENS_H
#define SEEDLENS_H

#include <stdint.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

#define SEEDLENS_SEARCH_RADIUS 5000
#define SEEDLENS_MAX_STRUCTURES 4096
#define SEEDLENS_MAX_CLUSTERS 20
#define SEEDLENS_MAX_CLUSTER_STRUCTURES 256
#define SEEDLENS_MAX_CATEGORIES 5

/* World Spawn coordinates */
typedef struct {
    int x;
    int z;
} SeedLensWorldSpawn;

/* Structure item in a cluster */
typedef struct {
    int type;
    const char *name;
    int x;
    int z;
    double distance_to_spawn;
    double distance_to_origin;
    const char *viability_status;
} SeedLensStructure;

/* Metrics of a cluster */
typedef struct {
    int count;
    int type_count;
    double center_x;
    double center_z;
    double nearest_spawn;   /* Distance to estimated true World Spawn */
    double nearest_origin;  /* Distance to World Origin (0, 0) */
    double diameter;
    double closest_pair;
    double density;
} SeedLensClusterMetrics;

/* Category evaluation */
typedef struct {
    int is_spawn_outpost;
    int is_mega_hub;
    int is_trading_metropolis;
    int is_abyssal_hub;
    int is_dense_multi;

    int category_count;
    const char *primary_category;
    const char *categories[SEEDLENS_MAX_CATEGORIES];
} SeedLensCategoryInfo;

/* Structure inventory count entry */
typedef struct {
    const char *type_name;
    int count;
} SeedLensTypeCount;

/* Full cluster result */
typedef struct {
    int id; /* 1-based cluster ID */
    int is_useful;
    SeedLensClusterMetrics metrics;
    SeedLensCategoryInfo category_info;

    int structure_count;
    SeedLensStructure structures[SEEDLENS_MAX_CLUSTER_STRUCTURES];

    int inventory_type_count;
    SeedLensTypeCount inventory[5];

    char explanation[2048];
} SeedLensClusterResult;

/* Search bounds */
typedef struct {
    int min_x;
    int max_x;
    int min_z;
    int max_z;
} SeedLensSearchBounds;

/* Summary */
typedef struct {
    int total_candidates;    /* Total candidate clusters found before dedup */
    int total_clusters;      /* Total deduplicated clusters evaluated */
    int useful_clusters;     /* Total Useful v3.1 clusters found */
    int clusters_truncated;  /* 1 if useful_clusters > SEEDLENS_MAX_CLUSTERS */
} SeedLensSummary;

#define SEEDLENS_MAX_DISCOVERED_STRUCTURES 2048

/* Discovered structure outside Useful v3.1 scoring */
typedef struct {
    int type;
    const char *name;
    int x;
    int z;
    double distance_to_spawn;
    double distance_to_origin;
    const char *viability_status;
} SeedLensDiscoveredStructure;

/* Discovery summary */
typedef struct {
    int total_discovered;
    int outpost_count;
    int monument_count;
    int mansion_count;
    int trail_ruins_count;
    int trial_chambers_count;
} SeedLensDiscoverySummary;

#define SEEDLENS_MAX_LANDMARKS 32

/* Landmark item (Scenic view, building basin, mountain caldera, survival island) */
typedef struct {
    int id;
    char category[32];
    char name_ar[128];
    char name_en[128];
    int x;
    int y;
    int z;
    double distance_to_spawn;
    char primary_biome[64];
    char surrounding_biomes[4][64];
    int surrounding_biome_count;
    int scenic_score;
    int building_score;
    char tags[4][32];
    int tag_count;
    char teleport_command[64];
    char description_ar[512];
    char description_en[512];
} SeedLensLandmark;

/* Landmarks collection result */
typedef struct {
    int total_found;
    int spot_count;
    SeedLensLandmark spots[SEEDLENS_MAX_LANDMARKS];
} SeedLensLandmarksResult;

/* Full analysis result */
typedef struct {
    int schema_version;
    int64_t seed;
    char minecraft_version[32];
    int mc_version_enum;
    SeedLensWorldSpawn world_spawn;
    SeedLensSearchBounds search;
    SeedLensSummary summary;

    int cluster_count;
    SeedLensClusterResult clusters[SEEDLENS_MAX_CLUSTERS];

    /* Discovered structures (outside Useful v3.1 scoring) */
    SeedLensDiscoverySummary discovery_summary;
    int discovered_count;
    SeedLensDiscoveredStructure discovered_structures[SEEDLENS_MAX_DISCOVERED_STRUCTURES];

    /* Landmarks & Scenic/Building Spots */
    SeedLensLandmarksResult landmarks;
} SeedLensAnalysisResult;

/* API functions */
int seedlens_analyze(
    int64_t seed,
    const char *minecraft_version,
    SeedLensAnalysisResult *result
);

char *seedlens_result_to_json(
    const SeedLensAnalysisResult *result
);

void seedlens_free_json(
    char *json_str
);

/* Find Query for Reverse Seed Finder */
typedef struct {
    const char *version;
    const char *preset;             /* "mega_builder", "dungeon_raider", "aesthetic_creator", "castaway_survivor", "economy_mogul" */
    const char *landmark_type;      /* "cherry_caldera", "mountain_crater", "epic_clifftop", "prime_building_basin", "isolated_island", "any" */
    const char *cluster_category;   /* "trading_metropolis", "abyssal_hub", "trial_chambers", "spawn_outpost", "strategic_mega_hub", "any" */
    int min_scenic_score;
    int min_building_score;
    int max_spawn_distance;
    int64_t start_seed;
    int max_seeds_to_scan;
} SeedLensFindQuery;

/* Result of Reverse Seed Finder */
typedef struct {
    int found;
    int64_t seed;
    char version[32];
    char matched_preset[32];
    char highlight_title[128];
    char highlight_type[32];        /* "landmark", "cluster", "discovery" */
    char highlight_name[128];
    char highlight_category[64];
    int highlight_x;
    int highlight_y;
    int highlight_z;
    double highlight_distance;
    int highlight_scenic_score;
    int highlight_building_score;
    char highlight_tp_command[64];
    char highlight_description[512];
    char highlight_primary_biome[64];
    int seeds_evaluated;
    double search_time_ms;
} SeedLensFindResult;

int seedlens_find(
    const SeedLensFindQuery *query,
    SeedLensFindResult *result
);

char *seedlens_find_result_to_json(
    const SeedLensFindResult *result
);

#ifdef __cplusplus
}
#endif

#endif /* SEEDLENS_H */
