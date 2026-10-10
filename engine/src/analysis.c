#include "internal.h"

int count_type(
    const Cluster *cluster,
    const StructureRecord *records,
    int type
)
{
    int count = 0;
    for (int i = 0; i < cluster->count; i++)
    {
        if (records[cluster->indices[i]].type == type)
        {
            count++;
        }
    }
    return count;
}

double type_pair_distance(
    const Cluster *cluster,
    const StructureRecord *records,
    int type_a,
    int type_b,
    int maximum
)
{
    double result = maximum ? 0.0 : 1e30;
    int found = 0;

    for (int i = 0; i < cluster->count; i++)
    {
        const StructureRecord *a = &records[cluster->indices[i]];

        for (int j = i + 1; j < cluster->count; j++)
        {
            const StructureRecord *b = &records[cluster->indices[j]];
            int pair_matches =
                (a->type == type_a && b->type == type_b) ||
                (a->type == type_b && b->type == type_a);

            if (!pair_matches)
            {
                continue;
            }

            double distance = distance_records(a, b);
            if (!found || (maximum ? distance > result : distance < result))
            {
                result = distance;
                found = 1;
            }
        }
    }

    return found ? result : -1.0;
}

static int useful_v3_spawn_outpost(
    const Cluster *cluster,
    const StructureRecord *records
)
{
    if (cluster->nearest_spawn > 1000.0)
    {
        return 0;
    }
    if (cluster->count < 3)
    {
        return 0;
    }
    if (cluster->max_distance > 720.0)
    {
        return 0;
    }
    if (cluster->density < 0.00001000)
    {
        return 0;
    }

    int v = count_type(cluster, records, Village);
    double d_v_sw = type_pair_distance(cluster, records, Village, Shipwreck, 0);
    double d_v_ac = type_pair_distance(cluster, records, Village, Ancient_City, 0);

    return ((d_v_sw > 0.0 && d_v_sw <= 450.0) ||
            (d_v_ac > 0.0 && d_v_ac <= 450.0) ||
            (v >= 2));
}

static int useful_v3_mega_hub(
    const Cluster *cluster,
    const StructureRecord *records
)
{
    (void)records;

    if (cluster->count < 5 ||
        cluster->type_count < 3 ||
        cluster->closest_distance > 180.0)
    {
        return 0;
    }

    if (cluster->max_distance <= 780.0)
    {
        return 1;
    }

    /* v3.1: high-diversity compact exception */
    return (cluster->max_distance <= 800.0 &&
            cluster->type_count >= 3 &&
            cluster->count >= 5 &&
            cluster->closest_distance <= 150.0);
}

static int useful_v3_trading_metropolis(
    const Cluster *cluster,
    const StructureRecord *records
)
{
    if (cluster->count < 4)
    {
        return 0;
    }
    if (cluster->max_distance > 760.0)
    {
        return 0;
    }
    if (cluster->density < 0.00001200)
    {
        return 0;
    }

    int v = count_type(cluster, records, Village);
    if (v < 2)
    {
        return 0;
    }

    double d_v_v_max = type_pair_distance(cluster, records, Village, Village, 1);
    return (d_v_v_max > 0.0 && d_v_v_max <= 600.0);
}

static int useful_v3_abyssal_hub(
    const Cluster *cluster,
    const StructureRecord *records
)
{
    if (cluster->count < 4)
    {
        return 0;
    }
    if (cluster->max_distance > 780.0)
    {
        return 0;
    }

    int ac = count_type(cluster, records, Ancient_City);
    if (ac < 1)
    {
        return 0;
    }

    int v = count_type(cluster, records, Village);
    int sw = count_type(cluster, records, Shipwreck);

    double d_v_ac = type_pair_distance(cluster, records, Village, Ancient_City, 0);
    double d_sw_ac = type_pair_distance(cluster, records, Shipwreck, Ancient_City, 0);

    /*
     * v3.1 Variant B:
     * - Village + Ancient City: distance <= 450
     * - Without Village: Shipwreck + Ancient City: distance <= 250
     */
    if (v >= 1)
    {
        return (d_v_ac > 0.0 && d_v_ac <= 450.0);
    }

    return (sw >= 1 &&
            d_sw_ac > 0.0 &&
            d_sw_ac <= 250.0);
}

static int useful_v3_dense_multi(
    const Cluster *cluster,
    const StructureRecord *records
)
{
    (void)records;
    return (cluster->closest_distance <= 100.0 &&
            cluster->count >= 4 &&
            cluster->max_distance <= 700.0 &&
            cluster->density >= 0.00001400);
}

ClusterAnalysis analyze_cluster_internal(
    const Cluster *cluster,
    const StructureRecord *records
)
{
    ClusterAnalysis analysis = {0};

    analysis.is_spawn_outpost = useful_v3_spawn_outpost(cluster, records);
    analysis.is_mega_hub = useful_v3_mega_hub(cluster, records);
    analysis.is_trading_metropolis = useful_v3_trading_metropolis(cluster, records);
    analysis.is_abyssal_hub = useful_v3_abyssal_hub(cluster, records);
    analysis.is_dense_multi = useful_v3_dense_multi(cluster, records);

    analysis.useful_v3_category_count =
        analysis.is_spawn_outpost +
        analysis.is_mega_hub +
        analysis.is_trading_metropolis +
        analysis.is_abyssal_hub +
        analysis.is_dense_multi;

    analysis.is_useful_v3 = (analysis.useful_v3_category_count > 0);

    return analysis;
}
