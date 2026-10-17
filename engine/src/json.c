#include "internal.h"
#include <stdarg.h>

typedef struct {
    char *data;
    size_t size;
    size_t capacity;
} JsonBuffer;

static void jbuf_init(JsonBuffer *b)
{
    b->capacity = 4096;
    b->size = 0;
    b->data = (char *)malloc(b->capacity);
    if (b->data)
    {
        b->data[0] = '\0';
    }
}

static void jbuf_ensure(JsonBuffer *b, size_t extra)
{
    if (!b->data) return;
    if (b->size + extra + 1 > b->capacity)
    {
        size_t new_cap = b->capacity * 2;
        if (new_cap < b->size + extra + 1)
        {
            new_cap = b->size + extra + 4096;
        }
        char *new_data = (char *)realloc(b->data, new_cap);
        if (!new_data)
        {
            return;
        }
        b->data = new_data;
        b->capacity = new_cap;
    }
}

static void jbuf_append(JsonBuffer *b, const char *str)
{
    if (!str || !b->data) return;
    size_t len = strlen(str);
    jbuf_ensure(b, len);
    if (b->size + len + 1 <= b->capacity)
    {
        memcpy(b->data + b->size, str, len);
        b->size += len;
        b->data[b->size] = '\0';
    }
}

static void jbuf_printf(JsonBuffer *b, const char *fmt, ...)
{
    if (!b->data) return;
    char tmp[1024];
    va_list args;
    va_start(args, fmt);
    int written = vsnprintf(tmp, sizeof(tmp), fmt, args);
    va_end(args);

    if (written > 0)
    {
        jbuf_ensure(b, (size_t)written);
        if (b->size + (size_t)written + 1 <= b->capacity)
        {
            memcpy(b->data + b->size, tmp, (size_t)written);
            b->size += (size_t)written;
            b->data[b->size] = '\0';
        }
    }
}

static void jbuf_append_escaped(JsonBuffer *b, const char *str)
{
    if (!str || !b->data) return;
    for (const char *p = str; *p; p++)
    {
        switch (*p)
        {
            case '\"': jbuf_append(b, "\\\""); break;
            case '\\': jbuf_append(b, "\\\\"); break;
            case '\b': jbuf_append(b, "\\b"); break;
            case '\f': jbuf_append(b, "\\f"); break;
            case '\n': jbuf_append(b, "\\n"); break;
            case '\r': jbuf_append(b, "\\r"); break;
            case '\t': jbuf_append(b, "\\t"); break;
            default:
                if ((unsigned char)*p < 0x20)
                {
                    jbuf_printf(b, "\\u%04x", (unsigned char)*p);
                }
                else
                {
                    char c[2] = {*p, '\0'};
                    jbuf_append(b, c);
                }
                break;
        }
    }
}

char *seedlens_result_to_json(const SeedLensAnalysisResult *result)
{
    if (!result) return NULL;

    JsonBuffer b;
    jbuf_init(&b);
    if (!b.data) return NULL;

    jbuf_append(&b, "{\n");
    jbuf_printf(&b, "  \"schema_version\": %d,\n", (result->schema_version > 0) ? result->schema_version : 1);
    jbuf_printf(&b, "  \"seed\": %lld,\n", (long long)result->seed);
    jbuf_printf(&b, "  \"seed_string\": \"%lld\",\n", (long long)result->seed);
    jbuf_printf(&b, "  \"minecraft_version\": \"%s\",\n", result->minecraft_version);

    /* World Spawn */
    jbuf_append(&b, "  \"world_spawn\": {\n");
    jbuf_printf(&b, "    \"x\": %d,\n", result->world_spawn.x);
    jbuf_printf(&b, "    \"z\": %d\n", result->world_spawn.z);
    jbuf_append(&b, "  },\n");

    /* Search bounds */
    jbuf_append(&b, "  \"search\": {\n");
    jbuf_printf(&b, "    \"min_x\": %d,\n", result->search.min_x);
    jbuf_printf(&b, "    \"max_x\": %d,\n", result->search.max_x);
    jbuf_printf(&b, "    \"min_z\": %d,\n", result->search.min_z);
    jbuf_printf(&b, "    \"max_z\": %d\n", result->search.max_z);
    jbuf_append(&b, "  },\n");

    /* Summary */
    jbuf_append(&b, "  \"summary\": {\n");
    jbuf_printf(&b, "    \"total_candidates\": %d,\n", result->summary.total_candidates);
    jbuf_printf(&b, "    \"total_clusters\": %d,\n", result->summary.total_clusters);
    jbuf_printf(&b, "    \"useful_clusters\": %d,\n", result->summary.useful_clusters);
    jbuf_printf(&b, "    \"clusters_truncated\": %s\n", result->summary.clusters_truncated ? "true" : "false");
    jbuf_append(&b, "  },\n");

    /* Clusters */
    jbuf_append(&b, "  \"clusters\": [\n");

    for (int i = 0; i < result->cluster_count; i++)
    {
        const SeedLensClusterResult *cr = &result->clusters[i];

        jbuf_append(&b, "    {\n");
        jbuf_printf(&b, "      \"id\": %d,\n", cr->id);
        jbuf_printf(&b, "      \"primary_category\": \"%s\",\n", cr->category_info.primary_category);

        /* Categories array */
        jbuf_append(&b, "      \"categories\": [\n");
        for (int c = 0; c < cr->category_info.category_count; c++)
        {
            jbuf_printf(&b, "        \"%s\"%s\n",
                cr->category_info.categories[c],
                (c + 1 < cr->category_info.category_count) ? "," : "");
        }
        jbuf_append(&b, "      ],\n");

        /* Center */
        jbuf_append(&b, "      \"center\": {\n");
        jbuf_printf(&b, "        \"x\": %.1f,\n", cr->metrics.center_x);
        jbuf_printf(&b, "        \"z\": %.1f\n", cr->metrics.center_z);
        jbuf_append(&b, "      },\n");

        /* Cluster metrics */
        jbuf_append(&b, "      \"cluster\": {\n");
        jbuf_printf(&b, "        \"count\": %d,\n", cr->metrics.count);
        jbuf_printf(&b, "        \"type_count\": %d,\n", cr->metrics.type_count);
        jbuf_printf(&b, "        \"diameter\": %.1f,\n", cr->metrics.diameter);
        jbuf_printf(&b, "        \"closest_pair\": %.1f,\n", cr->metrics.closest_pair);
        jbuf_printf(&b, "        \"nearest_spawn\": %.1f,\n", cr->metrics.nearest_spawn);
        jbuf_printf(&b, "        \"nearest_origin\": %.1f,\n", cr->metrics.nearest_origin);
        jbuf_printf(&b, "        \"density\": %.8f\n", cr->metrics.density);
        jbuf_append(&b, "      },\n");

        /* Structures Summary (Inventory) */
        jbuf_append(&b, "      \"structures_summary\": [\n");
        for (int inv = 0; inv < cr->inventory_type_count; inv++)
        {
            jbuf_append(&b, "        {\n");
            jbuf_printf(&b, "          \"type\": \"%s\",\n", cr->inventory[inv].type_name);
            jbuf_printf(&b, "          \"count\": %d\n", cr->inventory[inv].count);
            jbuf_printf(&b, "        }%s\n", (inv + 1 < cr->inventory_type_count) ? "," : "");
        }
        jbuf_append(&b, "      ],\n");

        /* Detailed structures */
        jbuf_append(&b, "      \"structures\": [\n");
        for (int s = 0; s < cr->structure_count; s++)
        {
            const SeedLensStructure *st = &cr->structures[s];
            jbuf_append(&b, "        {\n");
            jbuf_printf(&b, "          \"type\": \"%s\",\n", st->name);
            jbuf_printf(&b, "          \"x\": %d,\n", st->x);
            jbuf_printf(&b, "          \"z\": %d,\n", st->z);
            jbuf_printf(&b, "          \"distance_to_spawn\": %.1f,\n", st->distance_to_spawn);
            jbuf_printf(&b, "          \"distance_to_origin\": %.1f,\n", st->distance_to_origin);
            jbuf_printf(&b, "          \"viability_status\": \"%s\"\n", st->viability_status ? st->viability_status : "biome_viable");
            jbuf_printf(&b, "        }%s\n", (s + 1 < cr->structure_count) ? "," : "");
        }
        jbuf_append(&b, "      ],\n");

        /* Explanation */
        jbuf_append(&b, "      \"explanation\": \"");
        jbuf_append_escaped(&b, cr->explanation);
        jbuf_append(&b, "\"\n");

        jbuf_printf(&b, "    }%s\n", (i + 1 < result->cluster_count) ? "," : "");
    }

    jbuf_append(&b, "  ],\n");

    /* Discovered structures outside Useful v3.1 scoring */
    jbuf_append(&b, "  \"discovery\": {\n");
    jbuf_printf(&b, "    \"total_discovered\": %d,\n", result->discovery_summary.total_discovered);
    jbuf_append(&b, "    \"by_type\": {\n");
    jbuf_printf(&b, "      \"Pillager Outpost\": %d,\n", result->discovery_summary.outpost_count);
    jbuf_printf(&b, "      \"Ocean Monument\": %d,\n", result->discovery_summary.monument_count);
    jbuf_printf(&b, "      \"Woodland Mansion\": %d,\n", result->discovery_summary.mansion_count);
    jbuf_printf(&b, "      \"Trail Ruins\": %d,\n", result->discovery_summary.trail_ruins_count);
    jbuf_printf(&b, "      \"Trial Chambers\": %d\n", result->discovery_summary.trial_chambers_count);
    jbuf_append(&b, "    },\n");
    jbuf_append(&b, "    \"structures\": [\n");

    for (int i = 0; i < result->discovered_count; i++)
    {
        const SeedLensDiscoveredStructure *ds = &result->discovered_structures[i];
        jbuf_append(&b, "      {\n");
        jbuf_printf(&b, "        \"type\": \"%s\",\n", ds->name);
        jbuf_printf(&b, "        \"x\": %d,\n", ds->x);
        jbuf_printf(&b, "        \"z\": %d,\n", ds->z);
        jbuf_printf(&b, "        \"distance_to_spawn\": %.1f,\n", ds->distance_to_spawn);
        jbuf_printf(&b, "        \"distance_to_origin\": %.1f,\n", ds->distance_to_origin);
        jbuf_printf(&b, "        \"viability_status\": \"%s\"\n", ds->viability_status ? ds->viability_status : "biome_viable");
        jbuf_printf(&b, "      }%s\n", (i + 1 < result->discovered_count) ? "," : "");
    }

    jbuf_append(&b, "    ]\n");
    jbuf_append(&b, "  },\n");

    /* Landmarks: Scenic views, building basins, and aesthetic biomes */
    jbuf_append(&b, "  \"landmarks\": {\n");
    jbuf_printf(&b, "    \"total_found\": %d,\n", result->landmarks.total_found);
    jbuf_printf(&b, "    \"spot_count\": %d,\n", result->landmarks.spot_count);
    jbuf_append(&b, "    \"spots\": [\n");

    for (int i = 0; i < result->landmarks.spot_count; i++)
    {
        const SeedLensLandmark *lm = &result->landmarks.spots[i];
        jbuf_append(&b, "      {\n");
        jbuf_printf(&b, "        \"id\": %d,\n", lm->id);
        jbuf_printf(&b, "        \"category\": \"%s\",\n", lm->category);
        jbuf_append(&b, "        \"name_ar\": \"");
        jbuf_append_escaped(&b, lm->name_ar);
        jbuf_append(&b, "\",\n");
        jbuf_append(&b, "        \"name_en\": \"");
        jbuf_append_escaped(&b, lm->name_en);
        jbuf_append(&b, "\",\n");
        jbuf_printf(&b, "        \"x\": %d,\n", lm->x);
        jbuf_printf(&b, "        \"y\": %d,\n", lm->y);
        jbuf_printf(&b, "        \"z\": %d,\n", lm->z);
        jbuf_printf(&b, "        \"distance_to_spawn\": %.1f,\n", lm->distance_to_spawn);
        jbuf_printf(&b, "        \"primary_biome\": \"%s\",\n", lm->primary_biome);

        /* Surrounding biomes */
        jbuf_append(&b, "        \"surrounding_biomes\": [");
        for (int sb = 0; sb < lm->surrounding_biome_count; sb++)
        {
            jbuf_printf(&b, "\"%s\"%s", lm->surrounding_biomes[sb], (sb + 1 < lm->surrounding_biome_count) ? ", " : "");
        }
        jbuf_append(&b, "],\n");

        jbuf_printf(&b, "        \"scenic_score\": %d,\n", lm->scenic_score);
        jbuf_printf(&b, "        \"building_score\": %d,\n", lm->building_score);

        /* Tags */
        jbuf_append(&b, "        \"tags\": [");
        for (int tg = 0; tg < lm->tag_count; tg++)
        {
            jbuf_printf(&b, "\"%s\"%s", lm->tags[tg], (tg + 1 < lm->tag_count) ? ", " : "");
        }
        jbuf_append(&b, "],\n");

        jbuf_printf(&b, "        \"teleport_command\": \"%s\",\n", lm->teleport_command);
        jbuf_append(&b, "        \"description_ar\": \"");
        jbuf_append_escaped(&b, lm->description_ar);
        jbuf_append(&b, "\",\n");
        jbuf_append(&b, "        \"description_en\": \"");
        jbuf_append_escaped(&b, lm->description_en);
        jbuf_append(&b, "\"\n");

        jbuf_printf(&b, "      }%s\n", (i + 1 < result->landmarks.spot_count) ? "," : "");
    }

    jbuf_append(&b, "    ]\n");
    jbuf_append(&b, "  }\n");
    jbuf_append(&b, "}\n");

    return b.data;
}

void seedlens_free_json(char *json_str)
{
    if (json_str)
    {
        free(json_str);
    }
}
