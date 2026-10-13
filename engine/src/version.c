#include "internal.h"

static const StructureTarget targets_standard[] = {
    {"Village", Village},
    {"Desert Pyramid", Desert_Pyramid},
    {"Jungle Temple", Jungle_Pyramid},
    {"Shipwreck", Shipwreck},
    {"Ancient City", Ancient_City}
};
#define TARGETS_STANDARD_COUNT (sizeof(targets_standard) / sizeof(targets_standard[0]))

/* Additional discovered structures outside Useful v3.1 scoring */
static const StructureTarget discovered_targets_standard[] = {
    {"Pillager Outpost", Outpost},
    {"Ocean Monument", Monument},
    {"Woodland Mansion", Mansion},
    {"Trail Ruins", Trail_Ruins}
};
#define DISCOVERED_STANDARD_COUNT (sizeof(discovered_targets_standard) / sizeof(discovered_targets_standard[0]))

static const VersionProfile supported_profiles[] = {
    {
        .canonical_name = "1.20.6",
        .display_name = "Minecraft Java 1.20.6",
        .aliases = {"1.20.6", "1.20", NULL},
        .mc_enum = MC_1_20_6,
        .targets = targets_standard,
        .target_count = (int)TARGETS_STANDARD_COUNT,
        .discovered_targets = discovered_targets_standard,
        .discovered_target_count = (int)DISCOVERED_STANDARD_COUNT,
        .supports_terrain_check = 1
    },
    {
        .canonical_name = "1.21.1",
        .display_name = "Minecraft Java 1.21.1",
        .aliases = {"1.21.1", "1.21", NULL},
        .mc_enum = MC_1_21_1,
        .targets = targets_standard,
        .target_count = (int)TARGETS_STANDARD_COUNT,
        .discovered_targets = discovered_targets_standard,
        .discovered_target_count = (int)DISCOVERED_STANDARD_COUNT,
        .supports_terrain_check = 1
    }
};
#define PROFILE_COUNT (sizeof(supported_profiles) / sizeof(supported_profiles[0]))

const VersionProfile *get_version_profile(const char *version_str)
{
    if (version_str == NULL)
    {
        return &supported_profiles[0]; /* Default to 1.20.6 when omitted */
    }

    for (size_t i = 0; i < PROFILE_COUNT; i++)
    {
        if (strcmp(version_str, supported_profiles[i].canonical_name) == 0)
        {
            return &supported_profiles[i];
        }
        for (int a = 0; supported_profiles[i].aliases[a] != NULL; a++)
        {
            if (strcmp(version_str, supported_profiles[i].aliases[a]) == 0)
            {
                return &supported_profiles[i];
            }
        }
    }

    return NULL; /* Unsupported version */
}

const VersionProfile *get_default_version_profile(void)
{
    return &supported_profiles[0];
}

int get_supported_version_count(void)
{
    return (int)PROFILE_COUNT;
}

const VersionProfile *get_supported_version_profile_at(int index)
{
    if (index >= 0 && index < (int)PROFILE_COUNT)
    {
        return &supported_profiles[index];
    }
    return NULL;
}
