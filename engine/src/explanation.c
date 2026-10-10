#include "internal.h"

const char *primary_category_internal(const ClusterAnalysis *analysis)
{
    if (analysis->is_mega_hub)
    {
        return "Strategic Mega-Hub";
    }
    if (analysis->is_trading_metropolis)
    {
        return "Trading Metropolis";
    }
    if (analysis->is_abyssal_hub)
    {
        return "Abyssal Hub";
    }
    if (analysis->is_spawn_outpost)
    {
        return "Spawn Outpost";
    }
    if (analysis->is_dense_multi)
    {
        return "Dense Multi";
    }
    return "None";
}

void generate_explanation_internal(
    const Cluster *cluster,
    const StructureRecord *records,
    const ClusterAnalysis *analysis,
    char *out_buf,
    size_t out_buf_size
)
{
    const char *primary = primary_category_internal(analysis);

    if (strcmp(primary, "Strategic Mega-Hub") == 0)
    {
        snprintf(out_buf, out_buf_size,
            "This cluster contains %d structures across %d structure types with a closest "
            "pair of %.1f blocks and a diameter of %.1f blocks. The combination of high structure "
            "diversity and compact grouping makes it useful for exploration and progression.",
            cluster->count, cluster->type_count, cluster->closest_distance, cluster->max_distance);
    }
    else if (strcmp(primary, "Trading Metropolis") == 0)
    {
        int villages = count_type(cluster, records, Village);
        double v_spread = type_pair_distance(cluster, records, Village, Village, 1);
        snprintf(out_buf, out_buf_size,
            "This cluster contains %d Villages with a maximum spread of %.1f blocks within "
            "a %.1f block cluster. Multiple villages within a relatively compact area can support "
            "trading, villager management, and settlement expansion.",
            villages, v_spread, cluster->max_distance);
    }
    else if (strcmp(primary, "Abyssal Hub") == 0)
    {
        int villages = count_type(cluster, records, Village);
        double d_v_ac = type_pair_distance(cluster, records, Village, Ancient_City, 0);
        double d_sw_ac = type_pair_distance(cluster, records, Shipwreck, Ancient_City, 0);

        if (villages >= 1 && d_v_ac > 0.0 && d_v_ac <= 450.0)
        {
            snprintf(out_buf, out_buf_size,
                "An Ancient City is located within %.1f blocks (XZ) of a Village in a %.1f block cluster, "
                "creating a compact surface-to-underground exploration opportunity.",
                d_v_ac, cluster->max_distance);
        }
        else
        {
            snprintf(out_buf, out_buf_size,
                "An Ancient City is located within %.1f blocks (XZ) of a Shipwreck in a %.1f block cluster, "
                "combining coastal exploration with access to a nearby deep underground location.",
                d_sw_ac, cluster->max_distance);
        }
    }
    else if (strcmp(primary, "Spawn Outpost") == 0)
    {
        snprintf(out_buf, out_buf_size,
            "Located approximately %.1f blocks from estimated world spawn with %d structures within a %.1f block cluster. "
            "Being close to world spawn makes this cluster useful for early-game exploration and initial base development.",
            cluster->nearest_spawn, cluster->count, cluster->max_distance);
    }
    else if (strcmp(primary, "Dense Multi") == 0)
    {
        snprintf(out_buf, out_buf_size,
            "This compact cluster contains %d structures with a closest pair of "
            "%.1f blocks, a diameter of %.1f blocks, and a density of %.8f. "
            "The close spatial arrangement provides several nearby points of interest.",
            cluster->count, cluster->closest_distance, cluster->max_distance, cluster->density);
    }
    else
    {
        snprintf(out_buf, out_buf_size,
            "This cluster meets baseline useful criteria with %d structures across %.1f blocks.",
            cluster->count, cluster->max_distance);
    }
}
