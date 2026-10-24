#include "internal.h"

/* Useful v3.1 targets for 1.18 (Ancient City was not yet introduced) */
static const StructureTarget targets_118[] = {
    {"Village", Village},
    {"Desert Pyramid", Desert_Pyramid},
    {"Jungle Temple", Jungle_Pyramid},
    {"Shipwreck", Shipwreck}
};
#define TARGETS_118_COUNT (sizeof(targets_118) / sizeof(targets_118[0]))

/* Useful v3.1 targets for 1.19+ (Includes Ancient City) */
static const StructureTarget targets_standard[] = {
    {"Village", Village},
    {"Desert Pyramid", Desert_Pyramid},
    {"Jungle Temple", Jungle_Pyramid},
    {"Shipwreck", Shipwreck},
    {"Ancient City", Ancient_City}
};
#define TARGETS_STANDARD_COUNT (sizeof(targets_standard) / sizeof(targets_standard[0]))

/* Discovered structures for 1.18 and 1.19 (Before Trail Ruins and Trial Chambers) */
static const StructureTarget discovered_118_119[] = {
    {"Pillager Outpost", Outpost},
    {"Ocean Monument", Monument},
    {"Woodland Mansion", Mansion}
};
#define DISCOVERED_118_119_COUNT (sizeof(discovered_118_119) / sizeof(discovered_118_119[0]))

/* Discovered structures for 1.20 (Includes Trail Ruins) */
static const StructureTarget discovered_120[] = {
    {"Pillager Outpost", Outpost},
    {"Ocean Monument", Monument},
    {"Woodland Mansion", Mansion},
    {"Trail Ruins", Trail_Ruins}
};
#define DISCOVERED_120_COUNT (sizeof(discovered_120) / sizeof(discovered_120[0]))

/* Discovered structures for 1.21+ (Includes Trail Ruins and Trial Chambers) */
static const StructureTarget discovered_121[] = {
    {"Pillager Outpost", Outpost},
    {"Ocean Monument", Monument},
    {"Woodland Mansion", Mansion},
    {"Trail Ruins", Trail_Ruins},
    {"Trial Chambers", Trial_Chambers}
};
#define DISCOVERED_121_COUNT (sizeof(discovered_121) / sizeof(discovered_121[0]))

static const VersionProfile supported_profiles[] = {
    {
        .canonical_name = "1.18.2",
        .display_name = "Minecraft Java 1.18.2",
        .aliases = {"1.18.2", "1.18", NULL},
        .mc_enum = MC_1_18_2,
        .targets = targets_118,
        .target_count = (int)TARGETS_118_COUNT,
        .discovered_targets = discovered_118_119,
        .discovered_target_count = (int)DISCOVERED_118_119_COUNT,
        .supports_terrain_check = 1
    },
    {
        .canonical_name = "1.19.4",
        .display_name = "Minecraft Java 1.19.4",
        .aliases = {"1.19.4", "1.19", "1.19.2", NULL},
        .mc_enum = MC_1_19_4,
        .targets = targets_standard,
        .target_count = (int)TARGETS_STANDARD_COUNT,
        .discovered_targets = discovered_118_119,
        .discovered_target_count = (int)DISCOVERED_118_119_COUNT,
        .supports_terrain_check = 1
    },
    {
        .canonical_name = "1.20.6",
        .display_name = "Minecraft Java 1.20.6",
        .aliases = {"1.20.6", "1.20", NULL},
        .mc_enum = MC_1_20_6,
        .targets = targets_standard,
        .target_count = (int)TARGETS_STANDARD_COUNT,
        .discovered_targets = discovered_120,
        .discovered_target_count = (int)DISCOVERED_120_COUNT,
        .supports_terrain_check = 1
    },
    {
        .canonical_name = "1.21.1",
        .display_name = "Minecraft Java 1.21.1",
        .aliases = {"1.21.1", "1.21", NULL},
        .mc_enum = MC_1_21_1,
        .targets = targets_standard,
        .target_count = (int)TARGETS_STANDARD_COUNT,
        .discovered_targets = discovered_121,
        .discovered_target_count = (int)DISCOVERED_121_COUNT,
        .supports_terrain_check = 1
    },
    {
        .canonical_name = "1.21.3",
        .display_name = "Minecraft Java 1.21.3",
        .aliases = {"1.21.3", NULL},
        .mc_enum = MC_1_21_3,
        .targets = targets_standard,
        .target_count = (int)TARGETS_STANDARD_COUNT,
        .discovered_targets = discovered_121,
        .discovered_target_count = (int)DISCOVERED_121_COUNT,
        .supports_terrain_check = 1
    },
    {
        .canonical_name = "1.21.4",
        .display_name = "Minecraft Java 1.21.4",
        .aliases = {"1.21.4", "1.21-wd", "winter-drop", "26.3", "26.x", "26.0", "latest", NULL},
        .mc_enum = MC_1_21_WD,
        .targets = targets_standard,
        .target_count = (int)TARGETS_STANDARD_COUNT,
        .discovered_targets = discovered_121,
        .discovered_target_count = (int)DISCOVERED_121_COUNT,
        .supports_terrain_check = 1
    }
};
#define PROFILE_COUNT (sizeof(supported_profiles) / sizeof(supported_profiles[0]))

const VersionProfile *get_version_profile(const char *version_str)
{
    if (version_str == NULL)
    {
        return &supported_profiles[2]; /* Default to 1.20.6 when omitted */
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
    return &supported_profiles[2]; /* 1.20.6 */
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
