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

#define SEEDLENS_MAX_DISCOVERED_STRUCTURES 1024

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
} SeedLensDiscoverySummary;

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

#ifdef __cplusplus
}
#endif

#endif /* SEEDLENS_H */
