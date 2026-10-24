#include "seedlens.h"
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static void print_usage(const char *prog, FILE *stream)
{
    fprintf(stream, "Usage:\n");
    fprintf(stream, "  %s <seed> [--version <version>]\n", prog);
    fprintf(stream, "  %s find [--version <ver>] [--preset <preset>] [--landmark <type>]\n", prog);
    fprintf(stream, "          [--cluster <cat>] [--min-scenic <n>] [--min-building <n>]\n");
    fprintf(stream, "          [--max-dist <n>] [--start-seed <n>] [--max-seeds <n>]\n");
    fprintf(stream, "\nOptions:\n");
    fprintf(stream, "  --version <ver>   Minecraft version (1.18.2, 1.19.4, 1.20.6, 1.21.1, 1.21.3, 1.21.4, 26.3)\n");
    fprintf(stream, "  --preset <preset> Playstyle (mega_builder, dungeon_raider, aesthetic_creator, castaway_survivor, economy_mogul)\n");
    fprintf(stream, "  --landmark <type> Landmark archetype (cherry_caldera, mountain_crater, epic_clifftop, prime_building_basin, isolated_island)\n");
    fprintf(stream, "  --cluster <cat>   Cluster category (trading_metropolis, abyssal_hub, trial_chambers, spawn_outpost, strategic_mega_hub)\n");
    fprintf(stream, "  --help, -h        Show this help message\n");
}

static int handle_find_command(int argc, char *argv[])
{
    SeedLensFindQuery query;
    memset(&query, 0, sizeof(query));
    query.version = "1.20.6";
    query.max_spawn_distance = 2500;
    query.max_seeds_to_scan = 50000;

    for (int i = 2; i < argc; i++)
    {
        if (strcmp(argv[i], "--version") == 0 && i + 1 < argc)
        {
            query.version = argv[++i];
        }
        else if (strcmp(argv[i], "--preset") == 0 && i + 1 < argc)
        {
            query.preset = argv[++i];
        }
        else if (strcmp(argv[i], "--landmark") == 0 && i + 1 < argc)
        {
            query.landmark_type = argv[++i];
        }
        else if (strcmp(argv[i], "--cluster") == 0 && i + 1 < argc)
        {
            query.cluster_category = argv[++i];
        }
        else if (strcmp(argv[i], "--min-scenic") == 0 && i + 1 < argc)
        {
            query.min_scenic_score = atoi(argv[++i]);
        }
        else if (strcmp(argv[i], "--min-building") == 0 && i + 1 < argc)
        {
            query.min_building_score = atoi(argv[++i]);
        }
        else if (strcmp(argv[i], "--max-dist") == 0 && i + 1 < argc)
        {
            query.max_spawn_distance = atoi(argv[++i]);
        }
        else if (strcmp(argv[i], "--start-seed") == 0 && i + 1 < argc)
        {
            query.start_seed = (int64_t)strtoll(argv[++i], NULL, 10);
        }
        else if (strcmp(argv[i], "--max-seeds") == 0 && i + 1 < argc)
        {
            query.max_seeds_to_scan = atoi(argv[++i]);
        }
        else
        {
            fprintf(stderr, "Error: unrecognized argument '%s'.\n", argv[i]);
            print_usage(argv[0], stderr);
            return 1;
        }
    }

    SeedLensFindResult result;
    int ret = seedlens_find(&query, &result);
    if (ret != 0 && !result.found)
    {
        if (ret == -2)
        {
            fprintf(stderr, "Error: unsupported Minecraft version '%s'.\n", query.version);
        }
        else
        {
            fprintf(stderr, "Error: no matching seed found within scan limit.\n");
        }
        return 1;
    }

    char *json = seedlens_find_result_to_json(&result);
    if (!json)
    {
        fprintf(stderr, "Error: failed to serialize find result to JSON.\n");
        return 1;
    }

    fputs(json, stdout);
    free(json);
    return 0;
}

int main(int argc, char *argv[])
{
    if (argc < 2)
    {
        fprintf(stderr, "Error: missing seed argument.\n");
        print_usage(argv[0], stderr);
        return 1;
    }

    if (strcmp(argv[1], "--help") == 0 || strcmp(argv[1], "-h") == 0)
    {
        print_usage(argv[0], stdout);
        return 0;
    }

    if (strcmp(argv[1], "find") == 0)
    {
        return handle_find_command(argc, argv);
    }

    const char *seed_str = argv[1];
    const char *version = "1.20.6";

    for (int i = 2; i < argc; i++)
    {
        if (strcmp(argv[i], "--version") == 0 && i + 1 < argc)
        {
            version = argv[++i];
        }
        else
        {
            fprintf(stderr, "Error: unrecognized argument '%s'.\n", argv[i]);
            print_usage(argv[0], stderr);
            return 1;
        }
    }

    char *endptr = NULL;
    errno = 0;
    int64_t seed = (int64_t)strtoll(seed_str, &endptr, 10);
    if (errno == ERANGE)
    {
        fprintf(stderr, "Error: seed '%s' is out of range for a 64-bit signed integer.\n", seed_str);
        return 1;
    }
    if (*endptr != '\0' || seed_str[0] == '\0')
    {
        fprintf(stderr, "Error: invalid seed '%s'. Expected a 64-bit integer.\n", seed_str);
        return 1;
    }

    SeedLensAnalysisResult result;
    int ret = seedlens_analyze(seed, version, &result);
    if (ret != 0)
    {
        if (ret == -2)
        {
            fprintf(stderr, "Error: unsupported Minecraft version '%s'. Supported versions: 1.18.2, 1.19.4, 1.20.6, 1.21.1, 1.21.3, 1.21.4.\n", version);
        }
        else
        {
            fprintf(stderr, "Error: analysis failed for seed %lld (code %d).\n", (long long)seed, ret);
        }
        return 1;
    }

    char *json = seedlens_result_to_json(&result);
    if (!json)
    {
        fprintf(stderr, "Error: failed to serialize analysis result to JSON.\n");
        return 1;
    }

    fputs(json, stdout);
    seedlens_free_json(json);

    return 0;
}
