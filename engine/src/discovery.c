#include "internal.h"

double distance_xy(double x1, double z1, double x2, double z2)
{
    double dx = x1 - x2;
    double dz = z1 - z2;
    return sqrt(dx * dx + dz * dz);
}

double distance_records(const StructureRecord *a, const StructureRecord *b)
{
    return distance_xy(a->x, a->z, b->x, b->z);
}

int collect_records_internal(
    uint64_t seed,
    const VersionProfile *profile,
    StructureRecord *records,
    Pos *spawn_out
)
{
    if (!profile)
    {
        return 0;
    }

    Generator g;
    setupGenerator(&g, profile->mc_enum, 0);
    applySeed(&g, DIM_OVERWORLD, seed);

    Pos spawn_pos = getSpawn(&g);
    if (spawn_out)
    {
        *spawn_out = spawn_pos;
    }

    int record_count = 0;

    for (int t = 0; t < profile->target_count; t++)
    {
        StructureConfig config;
        if (!getStructureConfig(profile->targets[t].type, profile->mc_enum, &config))
        {
            continue;
        }

        int region_range = (SEEDLENS_SEARCH_RADIUS / (config.regionSize * 16)) + 2;

        for (int rz = -region_range; rz <= region_range; rz++)
        {
            for (int rx = -region_range; rx <= region_range; rx++)
            {
                Pos pos;
                if (!getStructurePos(profile->targets[t].type, profile->mc_enum, seed, rx, rz, &pos))
                {
                    continue;
                }

                if (pos.x < -SEEDLENS_SEARCH_RADIUS || pos.x > SEEDLENS_SEARCH_RADIUS ||
                    pos.z < -SEEDLENS_SEARCH_RADIUS || pos.z > SEEDLENS_SEARCH_RADIUS)
                {
                    continue;
                }

                if (!isViableStructurePos(profile->targets[t].type, &g, pos.x, pos.z, 0))
                {
                    continue;
                }

                if (record_count >= SEEDLENS_MAX_STRUCTURES)
                {
                    return record_count;
                }

                records[record_count].type = profile->targets[t].type;
                records[record_count].name = profile->targets[t].name;
                records[record_count].x = pos.x;
                records[record_count].z = pos.z;
                records[record_count].distance = sqrt((double)pos.x * pos.x + (double)pos.z * pos.z);

                double dx_sp = (double)pos.x - (double)spawn_pos.x;
                double dz_sp = (double)pos.z - (double)spawn_pos.z;
                records[record_count].distance_to_spawn = sqrt(dx_sp * dx_sp + dz_sp * dz_sp);

                if (profile->supports_terrain_check &&
                    (profile->targets[t].type == Desert_Pyramid || profile->targets[t].type == Jungle_Pyramid))
                {
                    if (isViableStructureTerrain(profile->targets[t].type, &g, pos.x, pos.z))
                    {
                        records[record_count].viability_status = "terrain_validated";
                    }
                    else
                    {
                        records[record_count].viability_status = "terrain_unlikely";
                    }
                }
                else
                {
                    records[record_count].viability_status = "biome_viable";
                }

                record_count++;
            }
        }
    }

    return record_count;
}

int collect_discovered_structures_internal(
    uint64_t seed,
    const VersionProfile *profile,
    Pos spawn_pos,
    SeedLensDiscoveredStructure *out_discovered,
    int max_discovered
)
{
    if (!profile || !out_discovered || max_discovered <= 0 || profile->discovered_target_count <= 0)
    {
        return 0;
    }

    Generator g;
    setupGenerator(&g, profile->mc_enum, 0);
    applySeed(&g, DIM_OVERWORLD, seed);

    int count = 0;

    for (int t = 0; t < profile->discovered_target_count; t++)
    {
        int stype = profile->discovered_targets[t].type;
        const char *sname = profile->discovered_targets[t].name;
        StructureConfig config;
        if (!getStructureConfig(stype, profile->mc_enum, &config))
        {
            continue;
        }

        int region_range = (SEEDLENS_SEARCH_RADIUS / (config.regionSize * 16)) + 2;

        for (int rz = -region_range; rz <= region_range; rz++)
        {
            for (int rx = -region_range; rx <= region_range; rx++)
            {
                Pos pos;
                if (!getStructurePos(stype, profile->mc_enum, seed, rx, rz, &pos))
                {
                    continue;
                }

                if (pos.x < -SEEDLENS_SEARCH_RADIUS || pos.x > SEEDLENS_SEARCH_RADIUS ||
                    pos.z < -SEEDLENS_SEARCH_RADIUS || pos.z > SEEDLENS_SEARCH_RADIUS)
                {
                    continue;
                }

                if (!isViableStructurePos(stype, &g, pos.x, pos.z, 0))
                {
                    continue;
                }

                if (count >= max_discovered)
                {
                    return count;
                }

                out_discovered[count].type = stype;
                out_discovered[count].name = sname;
                out_discovered[count].x = pos.x;
                out_discovered[count].z = pos.z;
                out_discovered[count].distance_to_origin = sqrt((double)pos.x * pos.x + (double)pos.z * pos.z);

                double dx_sp = (double)pos.x - (double)spawn_pos.x;
                double dz_sp = (double)pos.z - (double)spawn_pos.z;
                out_discovered[count].distance_to_spawn = sqrt(dx_sp * dx_sp + dz_sp * dz_sp);

                /*
                 * Terrain check: ONLY Woodland Mansion has an actual terrain depth
                 * check implemented in Cubiomes. Outpost, Monument, and Trail Ruins
                 * do not perform a terrain check. Per user instructions, do not label
                 * structures as terrain_validated if the function does not actually check them.
                 */
                if (stype == Mansion && profile->supports_terrain_check)
                {
                    if (isViableStructureTerrain(Mansion, &g, pos.x, pos.z))
                    {
                        out_discovered[count].viability_status = "terrain_validated";
                    }
                    else
                    {
                        out_discovered[count].viability_status = "terrain_unlikely";
                    }
                }
                else
                {
                    out_discovered[count].viability_status = "biome_viable";
                }

                count++;
            }
        }
    }

    return count;
}
