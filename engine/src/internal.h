#ifndef SEEDLENS_INTERNAL_H
#define SEEDLENS_INTERNAL_H

#include "seedlens.h"
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>
#include <math.h>
#include <string.h>

/* Cubiomes headers */
#include "generator.h"
#include "finders.h"
#include "biomes.h"

#define CLUSTER_RADIUS 500.0
#define MAX_CLUSTER_DIAMETER 800.0
#define MIN_CLUSTER_STRUCTURES 3
#define MIN_CLUSTER_TYPES 2

typedef struct {
    const char *name;
    int type;
} StructureTarget;

/* Version profile definition */
typedef struct {
    const char *canonical_name;      /* e.g. "1.20.6" */
    const char *display_name;        /* e.g. "Minecraft Java 1.20.6" */
    const char *aliases[4];          /* {"1.20.6", "1.20", NULL} */
    int mc_enum;                     /* Cubiomes MCVersion enum */
    const StructureTarget *targets;  /* Useful v3.1 scoring targets (5 core structures) */
    int target_count;                /* number of scoring targets */
    const StructureTarget *discovered_targets; /* additional discovery targets outside v3.1 */
    int discovered_target_count;     /* number of discovered targets */
    int supports_terrain_check;      /* 1 for terrain check support */
} VersionProfile;

typedef struct {
    int type;
    const char *name;
    int x;
    int z;
    double distance;          /* distance to origin (0, 0) */
    double distance_to_spawn; /* distance to estimated true world spawn */
    const char *viability_status;
} StructureRecord;

typedef struct {
    int indices[SEEDLENS_MAX_STRUCTURES];
    int count;
    int type_count;
    double center_x;
    double center_z;
    double nearest_spawn;     /* min distance among members to World Spawn */
    double nearest_origin;    /* min distance among members to Origin (0, 0) */
    double max_distance;
    double closest_distance;
    int closest_a;
    int closest_b;
    double density;
} Cluster;

typedef struct {
    int is_spawn_outpost;
    int is_mega_hub;
    int is_trading_metropolis;
    int is_abyssal_hub;
    int is_dense_multi;
    int useful_v3_category_count;
    int is_useful_v3;
} ClusterAnalysis;

/* Function prototypes across internal modules */
double distance_xy(double x1, double z1, double x2, double z2);
double distance_records(const StructureRecord *a, const StructureRecord *b);
int count_type(const Cluster *cluster, const StructureRecord *records, int type);
double type_pair_distance(const Cluster *cluster, const StructureRecord *records, int type_a, int type_b, int maximum);

/* Version management */
const VersionProfile *get_version_profile(const char *version_str);
const VersionProfile *get_default_version_profile(void);
int get_supported_version_count(void);
const VersionProfile *get_supported_version_profile_at(int index);

int collect_records_internal(
    uint64_t seed,
    const VersionProfile *profile,
    StructureRecord *records,
    Pos *spawn_out
);
int collect_discovered_structures_internal(
    uint64_t seed,
    const VersionProfile *profile,
    Pos spawn_pos,
    SeedLensDiscoveredStructure *out_discovered,
    int max_discovered
);
int detect_clusters_internal(
    StructureRecord *records,
    int record_count,
    Cluster *final_clusters,
    int max_final_clusters,
    int *candidate_count_out
);
ClusterAnalysis analyze_cluster_internal(const Cluster *cluster, const StructureRecord *records);
const char *primary_category_internal(const ClusterAnalysis *analysis);
void generate_explanation_internal(
    const Cluster *cluster,
    const StructureRecord *records,
    const ClusterAnalysis *analysis,
    char *out_buf,
    size_t out_buf_size
);

int collect_landmarks_internal(
    uint64_t seed,
    const VersionProfile *profile,
    Pos spawn_pos,
    SeedLensLandmarksResult *out_landmarks
);

#endif /* SEEDLENS_INTERNAL_H */
