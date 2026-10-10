#include "seedlens.h"
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static void print_usage(const char *prog, FILE *stream)
{
    fprintf(stream, "Usage: %s <seed> [--version <version>]\n", prog);
    fprintf(stream, "Options:\n");
    fprintf(stream, "  --version <ver>   Minecraft version (supported: 1.20.6)\n");
    fprintf(stream, "  --help, -h        Show this help message\n");
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
            fprintf(stderr, "Error: unsupported Minecraft version '%s'. Only '1.20.6' is supported.\n", version);
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
