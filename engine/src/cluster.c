#include "internal.h"

static Cluster build_cluster(
    StructureRecord *records,
    int count,
    int center_index
)
{
    Cluster cluster;
    memset(&cluster, 0, sizeof(cluster));

    cluster.closest_distance = 1e30;
    cluster.nearest_spawn = 1e30;
    cluster.density = 0.0;

    int type_seen[FEATURE_NUM];
    memset(type_seen, 0, sizeof(type_seen));

    StructureRecord *center = &records[center_index];

    /* PASS 1: Collect viable structures within local radius */
    for (int i = 0; i < count; i++)
    {
        double d = distance_records(center, &records[i]);
        if (d > CLUSTER_RADIUS)
        {
            continue;
        }

        if (cluster.count >= SEEDLENS_MAX_STRUCTURES)
        {
            break;
        }

        cluster.indices[cluster.count] = i;
        cluster.count++;

        if (records[i].type >= 0 && records[i].type < FEATURE_NUM)
        {
            if (!type_seen[records[i].type])
            {
                type_seen[records[i].type] = 1;
                cluster.type_count++;
            }
        }

        if (records[i].distance < cluster.nearest_spawn)
        {
            cluster.nearest_spawn = records[i].distance;
        }
    }

    /* PASS 2: Calculate geometric center */
    if (cluster.count > 0)
    {
        double sx = 0.0;
        double sz = 0.0;
        for (int i = 0; i < cluster.count; i++)
        {
            StructureRecord *r = &records[cluster.indices[i]];
            sx += r->x;
            sz += r->z;
        }
        cluster.center_x = sx / cluster.count;
        cluster.center_z = sz / cluster.count;
    }

    /* PASS 3: Calculate closest pair and maximum diameter */
    for (int i = 0; i < cluster.count; i++)
    {
        for (int j = i + 1; j < cluster.count; j++)
        {
            StructureRecord *a = &records[cluster.indices[i]];
            StructureRecord *b = &records[cluster.indices[j]];
            double d = distance_records(a, b);

            if (d < cluster.closest_distance)
            {
                cluster.closest_distance = d;
                cluster.closest_a = cluster.indices[i];
                cluster.closest_b = cluster.indices[j];
            }

            if (d > cluster.max_distance)
            {
                cluster.max_distance = d;
            }
        }
    }

    /* PASS 4: Reject clusters whose diameter exceeds MAX_CLUSTER_DIAMETER (800) */
    if (cluster.count >= 2 && cluster.max_distance > MAX_CLUSTER_DIAMETER)
    {
        cluster.count = 0;
        cluster.type_count = 0;
        return cluster;
    }

    /* PASS 5: Calculate density */
    if (cluster.count >= 2 && cluster.max_distance > 0.0)
    {
        double radius = cluster.max_distance / 2.0;
        double area = M_PI * radius * radius;
        cluster.density = (double)cluster.count / area;
    }
    else
    {
        cluster.density = 0.0;
    }

    return cluster;
}

static int cluster_better(const Cluster *a, const Cluster *b)
{
    if (a->type_count != b->type_count)
    {
        return a->type_count > b->type_count;
    }
    if (a->count != b->count)
    {
        return a->count > b->count;
    }
    return a->nearest_spawn < b->nearest_spawn;
}

static int same_cluster(const Cluster *a, const Cluster *b)
{
    double center_distance = distance_xy(
        a->center_x, a->center_z,
        b->center_x, b->center_z
    );

    if (center_distance < 250.0)
    {
        return 1;
    }

    int intersection = 0;
    for (int i = 0; i < a->count; i++)
    {
        int index_a = a->indices[i];
        for (int j = 0; j < b->count; j++)
        {
            if (index_a == b->indices[j])
            {
                intersection++;
                break;
            }
        }
    }

    int smaller_count = a->count < b->count ? a->count : b->count;
    if (smaller_count > 0)
    {
        double overlap = (double)intersection / (double)smaller_count;
        if (overlap >= 0.60)
        {
            return 1;
        }
    }

    return 0;
}

int detect_clusters_internal(
    StructureRecord *records,
    int record_count,
    Cluster *final_clusters,
    int *candidate_count_out
)
{
    static Cluster candidates[SEEDLENS_MAX_STRUCTURES];
    int candidate_count = 0;

    for (int i = 0; i < record_count; i++)
    {
        Cluster cluster = build_cluster(records, record_count, i);

        if (cluster.count < MIN_CLUSTER_STRUCTURES ||
            cluster.type_count < MIN_CLUSTER_TYPES)
        {
            continue;
        }

        if (candidate_count >= SEEDLENS_MAX_STRUCTURES)
        {
            break;
        }

        candidates[candidate_count++] = cluster;
    }

    /* Rank candidate clusters */
    for (int i = 0; i < candidate_count; i++)
    {
        for (int j = i + 1; j < candidate_count; j++)
        {
            if (cluster_better(&candidates[j], &candidates[i]))
            {
                Cluster temp = candidates[i];
                candidates[i] = candidates[j];
                candidates[j] = temp;
            }
        }
    }

    /* Deduplicate top clusters up to SEEDLENS_MAX_CLUSTERS */
    int final_count = 0;
    for (int i = 0; i < candidate_count && final_count < SEEDLENS_MAX_CLUSTERS; i++)
    {
        int duplicate = 0;
        for (int j = 0; j < final_count; j++)
        {
            if (same_cluster(&candidates[i], &final_clusters[j]))
            {
                duplicate = 1;
                break;
            }
        }

        if (!duplicate)
        {
            final_clusters[final_count++] = candidates[i];
        }
    }

    if (candidate_count_out)
    {
        *candidate_count_out = candidate_count;
    }
    return final_count;
}
