#include "internal.h"

static const struct {
    int type;
    const char *name;
} target_meta[] = {
    {Village, "Village"},
    {Desert_Pyramid, "Desert Pyramid"},
    {Jungle_Pyramid, "Jungle Temple"},
    {Shipwreck, "Shipwreck"},
    {Ancient_City, "Ancient City"}
};
#define TARGET_META_COUNT (sizeof(target_meta) / sizeof(target_meta[0]))

int seedlens_analyze(
    int64_t seed,
    const char *minecraft_version,
    SeedLensAnalysisResult *result
)
{
    if (!result)
    {
        return -1;
    }

    memset(result, 0, sizeof(*result));

    /* Version check: only 1.20.6 supported currently */
    const char *ver = (minecraft_version && minecraft_version[0]) ? minecraft_version : "1.20.6";
    if (strcmp(ver, "1.20.6") != 0)
    {
        return -2; /* Unsupported version */
    }

    result->schema_version = 1;
    result->seed = seed;
    snprintf(result->minecraft_version, sizeof(result->minecraft_version), "%s", ver);
    result->mc_version_enum = MC_1_20_6;

    result->search.min_x = -SEEDLENS_SEARCH_RADIUS;
    result->search.max_x = SEEDLENS_SEARCH_RADIUS;
    result->search.min_z = -SEEDLENS_SEARCH_RADIUS;
    result->search.max_z = SEEDLENS_SEARCH_RADIUS;

    /* Collect records */
    Pos spawn_pos = {0, 0};
    static StructureRecord records[SEEDLENS_MAX_STRUCTURES];
    int record_count = collect_records_internal((uint64_t)seed, MC_1_20_6, records, &spawn_pos);

    result->world_spawn.x = spawn_pos.x;
    result->world_spawn.z = spawn_pos.z;

    /* Detect clusters */
    static Cluster clusters[SEEDLENS_MAX_CLUSTERS];
    int candidate_count = 0;
    int cluster_count = detect_clusters_internal(records, record_count, clusters, &candidate_count);

    result->summary.total_clusters = cluster_count;
    result->summary.useful_clusters = 0;

    int out_index = 0;

    for (int i = 0; i < cluster_count; i++)
    {
        const Cluster *c = &clusters[i];
        ClusterAnalysis analysis = analyze_cluster_internal(c, records);

        if (!analysis.is_useful_v3)
        {
            continue;
        }

        SeedLensClusterResult *cr = &result->clusters[out_index++];
        cr->id = i + 1; /* 1-based cluster ID */
        cr->is_useful = 1;

        /* Metrics */
        cr->metrics.count = c->count;
        cr->metrics.type_count = c->type_count;
        cr->metrics.center_x = c->center_x;
        cr->metrics.center_z = c->center_z;
        cr->metrics.nearest_spawn = c->nearest_spawn;
        cr->metrics.diameter = c->max_distance;
        cr->metrics.closest_pair = c->closest_distance;
        cr->metrics.density = c->density;

        /* Category info */
        cr->category_info.is_spawn_outpost = analysis.is_spawn_outpost;
        cr->category_info.is_mega_hub = analysis.is_mega_hub;
        cr->category_info.is_trading_metropolis = analysis.is_trading_metropolis;
        cr->category_info.is_abyssal_hub = analysis.is_abyssal_hub;
        cr->category_info.is_dense_multi = analysis.is_dense_multi;

        cr->category_info.primary_category = primary_category_internal(&analysis);

        int cat_count = 0;
        if (analysis.is_spawn_outpost) cr->category_info.categories[cat_count++] = "Spawn Outpost";
        if (analysis.is_mega_hub) cr->category_info.categories[cat_count++] = "Strategic Mega-Hub";
        if (analysis.is_trading_metropolis) cr->category_info.categories[cat_count++] = "Trading Metropolis";
        if (analysis.is_abyssal_hub) cr->category_info.categories[cat_count++] = "Abyssal Hub";
        if (analysis.is_dense_multi) cr->category_info.categories[cat_count++] = "Dense Multi";
        cr->category_info.category_count = cat_count;

        /* Structures list */
        cr->structure_count = (c->count < SEEDLENS_MAX_CLUSTER_STRUCTURES) ? c->count : SEEDLENS_MAX_CLUSTER_STRUCTURES;
        for (int s = 0; s < cr->structure_count; s++)
        {
            const StructureRecord *sr = &records[c->indices[s]];
            cr->structures[s].type = sr->type;
            cr->structures[s].name = sr->name;
            cr->structures[s].x = sr->x;
            cr->structures[s].z = sr->z;
            cr->structures[s].distance_to_spawn = sr->distance_to_spawn;
            cr->structures[s].distance_to_origin = sr->distance;
            cr->structures[s].viability_status = sr->viability_status;
        }

        /* Inventory summary */
        int inv_count = 0;
        for (size_t t = 0; t < TARGET_META_COUNT; t++)
        {
            int cnt = count_type(c, records, target_meta[t].type);
            if (cnt > 0 && inv_count < 5)
            {
                cr->inventory[inv_count].type_name = target_meta[t].name;
                cr->inventory[inv_count].count = cnt;
                inv_count++;
            }
        }
        cr->inventory_type_count = inv_count;

        /* Explanation */
        generate_explanation_internal(c, records, &analysis, cr->explanation, sizeof(cr->explanation));

        result->summary.useful_clusters++;
    }

    result->cluster_count = out_index;
    return 0;
}
