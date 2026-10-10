#include "internal.h"

static StructureTarget targets[] = {
    {"Village", Village},
    {"Desert Pyramid", Desert_Pyramid},
    {"Jungle Temple", Jungle_Pyramid},
    {"Shipwreck", Shipwreck},
    {"Ancient City", Ancient_City}
};
#define TARGET_COUNT (sizeof(targets) / sizeof(targets[0]))

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

int collect_records_internal(uint64_t seed, int mc, StructureRecord *records, Pos *spawn_out)
{
    Generator g;
    setupGenerator(&g, mc, 0);
    applySeed(&g, DIM_OVERWORLD, seed);

    Pos spawn_pos = getSpawn(&g);
    if (spawn_out)
    {
        *spawn_out = spawn_pos;
    }

    int record_count = 0;

    for (size_t t = 0; t < TARGET_COUNT; t++)
    {
        StructureConfig config;
        if (!getStructureConfig(targets[t].type, mc, &config))
        {
            continue;
        }

        int region_range = (SEEDLENS_SEARCH_RADIUS / (config.regionSize * 16)) + 2;

        for (int rz = -region_range; rz <= region_range; rz++)
        {
            for (int rx = -region_range; rx <= region_range; rx++)
            {
                Pos pos;
                if (!getStructurePos(targets[t].type, mc, seed, rx, rz, &pos))
                {
                    continue;
                }

                if (pos.x < -SEEDLENS_SEARCH_RADIUS || pos.x > SEEDLENS_SEARCH_RADIUS ||
                    pos.z < -SEEDLENS_SEARCH_RADIUS || pos.z > SEEDLENS_SEARCH_RADIUS)
                {
                    continue;
                }

                if (!isViableStructurePos(targets[t].type, &g, pos.x, pos.z, 0))
                {
                    continue;
                }

                if (record_count >= SEEDLENS_MAX_STRUCTURES)
                {
                    return record_count;
                }

                records[record_count].type = targets[t].type;
                records[record_count].name = targets[t].name;
                records[record_count].x = pos.x;
                records[record_count].z = pos.z;
                records[record_count].distance = sqrt((double)pos.x * pos.x + (double)pos.z * pos.z);

                double dx_sp = (double)pos.x - (double)spawn_pos.x;
                double dz_sp = (double)pos.z - (double)spawn_pos.z;
                records[record_count].distance_to_spawn = sqrt(dx_sp * dx_sp + dz_sp * dz_sp);

                if (targets[t].type == Desert_Pyramid || targets[t].type == Jungle_Pyramid)
                {
                    if (isViableStructureTerrain(targets[t].type, &g, pos.x, pos.z))
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
