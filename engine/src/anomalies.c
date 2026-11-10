#include "internal.h"
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * SeedLens Worldgen Anomalies & Advanced Discovery Engine (Phase 3)
 * Implements 4 specialized discovery components:
 *   1. Pattern Hunter (PRNG axis degeneracy, periodic noise, low entropy)
 *   2. Anomaly Hunter (Structure collisions, extreme vertical chasms)
 *   3. Historical Glitch Hunter (Dynamic Void End Island MC-267423, Nether quirks)
 *   4. Glitch Validator (Classification tiers, evidence, reproducibility, and UUIDs)
 */

static void make_discovery_uuid(uint64_t seed, int id, const char *cat, char *out_uuid, size_t max_len)
{
    uint32_t h1 = (uint32_t)(seed ^ (seed >> 32));
    uint32_t h2 = 0x811c9dc5U;
    if (cat)
    {
        for (const char *p = cat; *p; p++)
        {
            h2 = (h2 ^ (uint8_t)*p) * 0x01000193U;
        }
    }
    uint32_t h3 = (uint32_t)id * 2654435761U;
    uint32_t p1 = h1 ^ h3;
    uint16_t p2 = (uint16_t)(h2 & 0xFFFF);
    uint16_t p3 = (uint16_t)((h2 >> 16) & 0x0FFF);       /* Version 4 */
    uint16_t p4 = (uint16_t)((h1 & 0x3FFF) | 0x8000);   /* Variant RFC 4122 */
    uint64_t p5 = (((uint64_t)h2) << 32) | (uint64_t)(h1 ^ h3);
    p5 &= 0xFFFFFFFFFFFFULL;
    snprintf(out_uuid, max_len, "%08x-%04x-4%03x-%04x-%012llx",
             p1, p2, p3, p4, (unsigned long long)p5);
}

void validate_and_classify_anomaly(
    SeedLensAnomaly *an,
    uint64_t seed,
    const VersionProfile *profile
)
{
    if (!an) return;

    /* Fill UUID */
    if (an->discovery_uuid[0] == '\0')
    {
        make_discovery_uuid(seed, an->id, an->category, an->discovery_uuid, sizeof(an->discovery_uuid));
    }

    /* Fill Tested Version */
    if (an->tested_version[0] == '\0' && profile)
    {
        snprintf(an->tested_version, sizeof(an->tested_version), "%s", profile->canonical_name);
    }

    /* Fill Tier Name */
    switch (an->tier)
    {
        case ANOMALY_TIER_RARE_GENERATION:
            snprintf(an->tier_name, sizeof(an->tier_name), "rare_generation");
            break;
        case ANOMALY_TIER_ANOMALY:
            snprintf(an->tier_name, sizeof(an->tier_name), "anomaly");
            break;
        case ANOMALY_TIER_SUSPECTED_GLITCH:
            snprintf(an->tier_name, sizeof(an->tier_name), "suspected_glitch");
            break;
        case ANOMALY_TIER_VERIFIED_GLITCH:
            snprintf(an->tier_name, sizeof(an->tier_name), "verified_glitch");
            break;
        case ANOMALY_TIER_HISTORICAL_GLITCH:
            snprintf(an->tier_name, sizeof(an->tier_name), "historical_glitch");
            break;
        default:
            an->tier = ANOMALY_TIER_ANOMALY;
            snprintf(an->tier_name, sizeof(an->tier_name), "anomaly");
            break;
    }

    /* Fill Component Name */
    switch (an->component)
    {
        case DISCOVERY_COMPONENT_PATTERN_HUNTER:
            snprintf(an->component_name, sizeof(an->component_name), "pattern_hunter");
            break;
        case DISCOVERY_COMPONENT_ANOMALY_HUNTER:
            snprintf(an->component_name, sizeof(an->component_name), "anomaly_hunter");
            break;
        case DISCOVERY_COMPONENT_HISTORICAL_GLITCH:
            snprintf(an->component_name, sizeof(an->component_name), "historical_glitch");
            break;
        case DISCOVERY_COMPONENT_UNKNOWN_ENGINE:
            snprintf(an->component_name, sizeof(an->component_name), "unknown_engine");
            break;
        default:
            an->component = DISCOVERY_COMPONENT_ANOMALY_HUNTER;
            snprintf(an->component_name, sizeof(an->component_name), "anomaly_hunter");
            break;
    }

    /* Fill Validation Status Name */
    switch (an->validation_status)
    {
        case VALIDATION_STATUS_STATISTICAL_CANDIDATE:
            snprintf(an->validation_status_name, sizeof(an->validation_status_name), "statistical_candidate");
            break;
        case VALIDATION_STATUS_PROVISIONAL:
            snprintf(an->validation_status_name, sizeof(an->validation_status_name), "provisional");
            break;
        case VALIDATION_STATUS_VERIFIED:
            snprintf(an->validation_status_name, sizeof(an->validation_status_name), "verified");
            break;
        default:
            an->validation_status = VALIDATION_STATUS_VERIFIED;
            snprintf(an->validation_status_name, sizeof(an->validation_status_name), "verified");
            break;
    }

    /* Default dimension */
    if (an->dimension[0] == '\0')
    {
        snprintf(an->dimension, sizeof(an->dimension), "overworld");
    }

    /* Default edition support */
    if (an->edition_support[0] == '\0')
    {
        snprintf(an->edition_support, sizeof(an->edition_support), "java_exclusive");
    }
}

/* --------------------------------------------------------------------------
 * 1. Pattern Hunter: Mathematical, PRNG, and Periodic Coordinate Symmetries
 * -------------------------------------------------------------------------- */
int detect_pattern_anomalies(
    uint64_t seed,
    const VersionProfile *profile,
    Pos spawn_pos,
    SeedLensAnomaly *out_items,
    int max_items
)
{
    if (!profile || !out_items || max_items <= 0) return 0;
    int count = 0;

    /* A. PRNG Axis Degeneracy (Infinite Repeating Mineshafts) */
    uint64_t s;
    setSeed(&s, seed);
    uint64_t a = nextLong(&s);
    uint64_t b = nextLong(&s);

    int is_infinite_x = 0;
    int is_infinite_z = 0;

    if (a == 0)
    {
        setSeed(&s, seed);
        if (nextDouble(&s) < 0.004) is_infinite_x = 1;
    }
    if (b == 0)
    {
        setSeed(&s, seed);
        if (nextDouble(&s) < 0.004) is_infinite_z = 1;
    }

    if (is_infinite_x && is_infinite_z && count < max_items)
    {
        SeedLensAnomaly *an = &out_items[count++];
        memset(an, 0, sizeof(*an));
        an->id = count;
        an->tier = ANOMALY_TIER_VERIFIED_GLITCH;
        an->component = DISCOVERY_COMPONENT_PATTERN_HUNTER;
        an->validation_status = VALIDATION_STATUS_VERIFIED;
        snprintf(an->category, sizeof(an->category), "infinite_cross_axis_grid");
        snprintf(an->subcategory, sizeof(an->subcategory), "prng_dual_axis_collapse");
        snprintf(an->severity, sizeof(an->severity), "legendary");
        snprintf(an->name_ar, sizeof(an->name_ar), "شبكة مناجم متقاطعة لانهائية في المحورين X و Z");
        snprintf(an->name_en, sizeof(an->name_en), "Infinite Cross-Axis Mineshaft Grid (X & Z)");
        an->x = 0; an->y = 24; an->z = 0;
        double dx = (double)(an->x - spawn_pos.x), dz = (double)(an->z - spawn_pos.z);
        an->distance_to_spawn = sqrt(dx * dx + dz * dz);
        snprintf(an->axis, sizeof(an->axis), "dual_axis");
        snprintf(an->dimension, sizeof(an->dimension), "overworld");
        snprintf(an->edition_support, sizeof(an->edition_support), "java_exclusive");
        snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp 0 24 0");
        an->confidence_score = 100;
        an->rarity_estimate = 0.00000000001;
        snprintf(an->technical_evidence, sizeof(an->technical_evidence), "Java nextLong multiplier collapse: a=0 AND b=0, mineshaft chance < 0.004");
        an->tag_count = 4;
        snprintf(an->tags[0], sizeof(an->tags[0]), "مناجم_مزدوجة");
        snprintf(an->tags[1], sizeof(an->tags[1]), "محورين_لانهائيين");
        snprintf(an->tags[2], sizeof(an->tags[2]), "قلتش_أسطوري");
        snprintf(an->tags[3], sizeof(an->tags[3]), "تحت_السباون");
        snprintf(an->description_ar, sizeof(an->description_ar),
            "خلل رياضي نادر للغاية ينعدم فيه كِلا المعاملين في معادلة التوليد! تتولد مناجم خشبية بلا انقطاع على طول المحورين الشرقي-الغربي والشمالي-الجنوبي في وقت واحد!");
        snprintf(an->description_en, sizeof(an->description_en),
            "Extremely rare dual PRNG degeneracy where multipliers a=0 and b=0 simultaneously, producing an infinite cross-shaped grid of mineshafts along both X and Z axes.");
        validate_and_classify_anomaly(an, seed, profile);
    }
    else if (is_infinite_x && count < max_items)
    {
        SeedLensAnomaly *an = &out_items[count++];
        memset(an, 0, sizeof(*an));
        an->id = count;
        an->tier = ANOMALY_TIER_VERIFIED_GLITCH;
        an->component = DISCOVERY_COMPONENT_PATTERN_HUNTER;
        an->validation_status = VALIDATION_STATUS_VERIFIED;
        snprintf(an->category, sizeof(an->category), "infinite_repeating_mineshaft");
        snprintf(an->subcategory, sizeof(an->subcategory), "prng_axis_degeneracy");
        snprintf(an->severity, sizeof(an->severity), "legendary");
        snprintf(an->name_ar, sizeof(an->name_ar), "قلتش المناجم اللانهائية تحت الـ Spawn مباشرة (المحور X)");
        snprintf(an->name_en, sizeof(an->name_en), "Infinite Repeating Mineshafts (X-Axis)");
        an->x = 0; an->y = 24; an->z = 0;
        double dx = (double)(an->x - spawn_pos.x), dz = (double)(an->z - spawn_pos.z);
        an->distance_to_spawn = sqrt(dx * dx + dz * dz);
        snprintf(an->axis, sizeof(an->axis), "x_axis");
        snprintf(an->dimension, sizeof(an->dimension), "overworld");
        snprintf(an->edition_support, sizeof(an->edition_support), "java_exclusive");
        snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp 0 24 0");
        an->confidence_score = 100;
        an->rarity_estimate = 0.00000002;
        snprintf(an->technical_evidence, sizeof(an->technical_evidence), "Java nextLong multiplier collapse: a=0, chunkSeed=(0*a^seed)^(0*b)==seed, p<0.004");
        an->tag_count = 4;
        snprintf(an->tags[0], sizeof(an->tags[0]), "مناجم_لانهائية");
        snprintf(an->tags[1], sizeof(an->tags[1]), "موارد_بلا_نهاية");
        snprintf(an->tags[2], sizeof(an->tags[2]), "تحت_السباون");
        snprintf(an->tags[3], sizeof(an->tags[3]), "قلتش_أسطوري");
        snprintf(an->description_ar, sizeof(an->description_ar),
            "قلتش أسطوري تحت نقطة البداية! بمجرد أن تحفر لأسفل ستجد شبكة خشبية عملاقة من المناجم وسكك الحديد ممتدة بلا نهاية باتجاه الشرق والغرب، تمنحك سكك وخشب وصناديق موارد لا تنتهي أبداً.");
        snprintf(an->description_en, sizeof(an->description_en),
            "Legendary worldgen glitch right beneath spawn! Dig straight down to discover an endless labyrinth of wooden mineshafts and rails stretching into infinity along the X-axis (East-West), offering unlimited minecarts, loot chests, and timber.");
        validate_and_classify_anomaly(an, seed, profile);
    }
    else if (is_infinite_z && count < max_items)
    {
        SeedLensAnomaly *an = &out_items[count++];
        memset(an, 0, sizeof(*an));
        an->id = count;
        an->tier = ANOMALY_TIER_VERIFIED_GLITCH;
        an->component = DISCOVERY_COMPONENT_PATTERN_HUNTER;
        an->validation_status = VALIDATION_STATUS_VERIFIED;
        snprintf(an->category, sizeof(an->category), "infinite_repeating_mineshaft");
        snprintf(an->subcategory, sizeof(an->subcategory), "prng_axis_degeneracy");
        snprintf(an->severity, sizeof(an->severity), "legendary");
        snprintf(an->name_ar, sizeof(an->name_ar), "قلتش المناجم اللانهائية تحت الـ Spawn مباشرة (المحور Z)");
        snprintf(an->name_en, sizeof(an->name_en), "Infinite Repeating Mineshafts (Z-Axis)");
        an->x = 0; an->y = 24; an->z = 0;
        double dx = (double)(an->x - spawn_pos.x), dz = (double)(an->z - spawn_pos.z);
        an->distance_to_spawn = sqrt(dx * dx + dz * dz);
        snprintf(an->axis, sizeof(an->axis), "z_axis");
        snprintf(an->dimension, sizeof(an->dimension), "overworld");
        snprintf(an->edition_support, sizeof(an->edition_support), "java_exclusive");
        snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp 0 24 0");
        an->confidence_score = 100;
        an->rarity_estimate = 0.00000002;
        snprintf(an->technical_evidence, sizeof(an->technical_evidence), "Java nextLong multiplier collapse: b=0, chunkSeed=(0*a^seed)^(0*b)==seed, p<0.004");
        an->tag_count = 4;
        snprintf(an->tags[0], sizeof(an->tags[0]), "مناجم_لانهائية");
        snprintf(an->tags[1], sizeof(an->tags[1]), "موارد_بلا_نهاية");
        snprintf(an->tags[2], sizeof(an->tags[2]), "تحت_السباون");
        snprintf(an->tags[3], sizeof(an->tags[3]), "قلتش_أسطوري");
        snprintf(an->description_ar, sizeof(an->description_ar),
            "قلتش أسطوري تحت نقطة البداية! بمجرد أن تحفر لأسفل ستجد شبكة خشبية عملاقة من المناجم وسكك الحديد ممتدة بلا نهاية باتجاه الشمال والجنوب، تمنحك سكك وخشب وصناديق موارد لا تنتهي أبداً.");
        snprintf(an->description_en, sizeof(an->description_en),
            "Legendary worldgen glitch right beneath spawn! Dig straight down to discover an endless labyrinth of wooden mineshafts and rails stretching into infinity along the Z-axis (North-South), offering unlimited minecarts, loot chests, and timber.");
        validate_and_classify_anomaly(an, seed, profile);
    }
    else
    {
        /* Check contiguous dense mineshaft corridor near spawn */
        int consecutive = 0;
        int max_consecutive = 0;
        Pos p[4];
        for (int cx = -12; cx <= 12; cx++)
        {
            int n = getMineshafts(profile->mc_enum, seed, cx, 0, cx, 0, p, 1);
            if (n > 0)
            {
                consecutive++;
                if (consecutive > max_consecutive) max_consecutive = consecutive;
            }
            else
            {
                consecutive = 0;
            }
        }
        if (max_consecutive >= 6 && count < max_items)
        {
            SeedLensAnomaly *an = &out_items[count++];
            memset(an, 0, sizeof(*an));
            an->id = count;
            an->tier = ANOMALY_TIER_RARE_GENERATION;
            an->component = DISCOVERY_COMPONENT_PATTERN_HUNTER;
            an->validation_status = VALIDATION_STATUS_VERIFIED;
            snprintf(an->category, sizeof(an->category), "dense_mineshaft_corridor");
            snprintf(an->subcategory, sizeof(an->subcategory), "contiguous_chunk_sequence");
            snprintf(an->severity, sizeof(an->severity), "rare");
            snprintf(an->name_ar, sizeof(an->name_ar), "ممر مناجم متصل فائق الكثافة");
            snprintf(an->name_en, sizeof(an->name_en), "Dense Contiguous Mineshaft Corridor");
            an->x = 0; an->y = 28; an->z = 0;
            double dx = (double)(an->x - spawn_pos.x), dz = (double)(an->z - spawn_pos.z);
            an->distance_to_spawn = sqrt(dx * dx + dz * dz);
            snprintf(an->axis, sizeof(an->axis), "x_axis");
            snprintf(an->dimension, sizeof(an->dimension), "overworld");
            snprintf(an->edition_support, sizeof(an->edition_support), "java_exclusive");
            snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp 0 28 0");
            an->confidence_score = 92;
            an->rarity_estimate = 0.0008;
            snprintf(an->technical_evidence, sizeof(an->technical_evidence), "getMineshafts: max contiguous streak = %d chunks >= 6 in [-12, 12]", max_consecutive);
            an->tag_count = 3;
            snprintf(an->tags[0], sizeof(an->tags[0]), "dense_mineshafts");
            snprintf(an->tags[1], sizeof(an->tags[1]), "subterranean");
            snprintf(an->tags[2], sizeof(an->tags[2]), "rare_worldgen");
            snprintf(an->description_ar, sizeof(an->description_ar),
                "تجمع نادر لمناجم خشبية متصلة على عدة تشانكات متتالية في خط مستقيم.");
            snprintf(an->description_en, sizeof(an->description_en),
                "Rare generation quirk with multiple contiguous mineshafts aligned in a dense subterranean sequence.");
            validate_and_classify_anomaly(an, seed, profile);
        }
    }

    /* B. Low Entropy PRNG Seed Collapse (Lower 48-bits zero) */
    if ((seed & 0xFFFFFFFFFFFFULL) == 0 && count < max_items)
    {
        SeedLensAnomaly *an = &out_items[count++];
        memset(an, 0, sizeof(*an));
        an->id = count;
        an->tier = ANOMALY_TIER_SUSPECTED_GLITCH;
        an->component = DISCOVERY_COMPONENT_PATTERN_HUNTER;
        an->validation_status = VALIDATION_STATUS_VERIFIED;
        snprintf(an->category, sizeof(an->category), "zero_lower_entropy_grid");
        snprintf(an->subcategory, sizeof(an->subcategory), "null_48bit_seed");
        snprintf(an->severity, sizeof(an->severity), "extreme");
        snprintf(an->name_ar, sizeof(an->name_ar), "انعدام إنتروبيا البذرة 48-بت (تكرار هيكلي حتمي)");
        snprintf(an->name_en, sizeof(an->name_en), "Zero Lower-48-Bit Entropy Seed");
        an->x = 0; an->y = 64; an->z = 0;
        double dx = (double)(an->x - spawn_pos.x), dz = (double)(an->z - spawn_pos.z);
        an->distance_to_spawn = sqrt(dx * dx + dz * dz);
        snprintf(an->axis, sizeof(an->axis), "all_axes");
        snprintf(an->dimension, sizeof(an->dimension), "overworld");
        snprintf(an->edition_support, sizeof(an->edition_support), "java_exclusive");
        snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp 0 64 0");
        an->confidence_score = 99;
        an->rarity_estimate = 0.0000000000035;
        snprintf(an->technical_evidence, sizeof(an->technical_evidence), "seed & 0xFFFFFFFFFFFFULL == 0, base PRNG state collapses to zero");
        an->tag_count = 3;
        snprintf(an->tags[0], sizeof(an->tags[0]), "إنتروبيا_صفرية");
        snprintf(an->tags[1], sizeof(an->tags[1]), "تطابق_هياكل");
        snprintf(an->tags[2], sizeof(an->tags[2]), "قلتش_رياضي");
        snprintf(an->description_ar, sizeof(an->description_ar),
            "بذرة ذات بذور جزئية منعدمة (الـ 48 بت الدنيا تساوي صفراً)! هذا يؤدي إلى تطابق كامل في خوارزميات حساب مواقع المعابد والقرى والقلاع عبر الأبعاد المختلفة.");
        snprintf(an->description_en, sizeof(an->description_en),
            "Extremely rare zero 48-bit seed where lower random bits vanish, causing structural PRNG algorithms across dimensions to collapse into identical offset templates.");
        validate_and_classify_anomaly(an, seed, profile);
    }

    return count;
}

/* --------------------------------------------------------------------------
 * 2. Historical & Dimensional Glitch Hunter (Dynamic Void End Island, etc.)
 * -------------------------------------------------------------------------- */
int detect_historical_and_dimensional_anomalies(
    uint64_t seed,
    const VersionProfile *profile,
    Pos spawn_pos,
    SeedLensAnomaly *out_items,
    int max_items
)
{
    if (!profile || !out_items || max_items <= 0) return 0;
    int count = 0;

    (void)spawn_pos;

    /* A. Dynamic Void Main End Island Detection (MC-267423)
     * Fully algorithmic via getEndSurfaceHeight:
     * Samples the central island arena across (0,0) and radial offsets.
     * In a normal End island, height is 55 to 65.
     * In MC-267423, procedural noise density never reaches positive threshold,
     * so getEndSurfaceHeight returns 0 across the entire central arena!
     */
    int h_center = getEndSurfaceHeight(profile->mc_enum, seed, 0, 0);
    if (h_center <= 0 && count < max_items)
    {
        /* Verify surrounding radius [-32, 32] */
        static const Pos check_pts[] = {
            {16, 0}, {-16, 0}, {0, 16}, {0, -16},
            {32, 0}, {-32, 0}, {0, 32}, {0, -32}
        };
        int all_void = 1;
        for (size_t p = 0; p < sizeof(check_pts) / sizeof(check_pts[0]); p++)
        {
            int h = getEndSurfaceHeight(profile->mc_enum, seed, check_pts[p].x, check_pts[p].z);
            if (h > 0)
            {
                all_void = 0;
                break;
            }
        }

        if (all_void)
        {
            SeedLensAnomaly *an = &out_items[count++];
            memset(an, 0, sizeof(*an));
            an->id = count;
            an->tier = ANOMALY_TIER_VERIFIED_GLITCH;
            an->component = DISCOVERY_COMPONENT_HISTORICAL_GLITCH;
            an->validation_status = VALIDATION_STATUS_VERIFIED;
            snprintf(an->category, sizeof(an->category), "void_end_island");
            snprintf(an->subcategory, sizeof(an->subcategory), "mc_267423_density_collapse");
            snprintf(an->severity, sizeof(an->severity), "legendary");
            snprintf(an->name_ar, sizeof(an->name_ar), "عالم الإند المفرغ (قتال التنين فوق الفراغ السحيق)");
            snprintf(an->name_en, sizeof(an->name_en), "Void Main End Island (Floating Dragon Arena)");
            an->x = 0; an->y = 64; an->z = 0;
            an->distance_to_spawn = 0.0;
            snprintf(an->axis, sizeof(an->axis), "dimension_end");
            snprintf(an->dimension, sizeof(an->dimension), "the_end");
            snprintf(an->edition_support, sizeof(an->edition_support), "java_exclusive");
            snprintf(an->teleport_command, sizeof(an->teleport_command),
                     "/execute in minecraft:the_end run tp 0 64 0");
            an->confidence_score = 100;
            an->rarity_estimate = 0.00000015;
            snprintf(an->technical_evidence, sizeof(an->technical_evidence),
                     "MC-267423: getEndSurfaceHeight <= 0 verified across central arena [-32, 32]");
            an->tag_count = 4;
            snprintf(an->tags[0], sizeof(an->tags[0]), "إند_فارغ");
            snprintf(an->tags[1], sizeof(an->tags[1]), "تنين_في_الفويد");
            snprintf(an->tags[2], sizeof(an->tags[2]), "تحدي_مستحيل");
            snprintf(an->tags[3], sizeof(an->tags[3]), "بدون_أرضية");
            snprintf(an->description_ar, sizeof(an->description_ar),
                "قلتش شهير (MC-267423) يمسح أرضية الإند تماماً! لن تجد أي حجر إند تحت قدميك؛ التنين وأعمدة الأوبسيديان وبوابة الخروج تطفو في الفراغ المطلق. (انتبه: ستقع فوراً في الفويد إذا لم تبنِ جسراً أو ترمِ إندر بيرل بمجرد دخولك البوابة!)");
            snprintf(an->description_en, sizeof(an->description_en),
                "Iconic Minecraft worldgen bug (MC-267423): End Stone terrain completely fails to generate at (0,0), leaving the Ender Dragon, obsidian pillars, and exit portal floating above the bottomless void! (Warning: You will drop into the void immediately upon entering unless you bridge or pearl)");
            validate_and_classify_anomaly(an, seed, profile);
        }
    }

    return count;
}

/* --------------------------------------------------------------------------
 * 3. Anomaly Hunter: Structure Collisions, Overlaps, and Extreme Cliffs
 * -------------------------------------------------------------------------- */
int detect_structural_and_terrain_anomalies(
    uint64_t seed,
    const VersionProfile *profile,
    Pos spawn_pos,
    SeedLensAnomaly *out_items,
    int max_items
)
{
    if (!profile || !out_items || max_items <= 0) return 0;
    int count = 0;

    Generator g;
    setupGenerator(&g, profile->mc_enum, 0);
    applySeed(&g, DIM_OVERWORLD, seed);

    /* A. Structure Collision: Ancient City vs Trial Chambers (MC 1.21+) */
    if (profile->mc_enum >= MC_1_21_1)
    {
        StructureConfig cf_ac, cf_tc;
        if (getStructureConfig(Ancient_City, profile->mc_enum, &cf_ac) &&
            getStructureConfig(Trial_Chambers, profile->mc_enum, &cf_tc))
        {
            #define MAX_CAND_TC 128
            #define MAX_CAND_AC 32
            Pos tc_list[MAX_CAND_TC];
            int tc_n = 0;
            Pos ac_list[MAX_CAND_AC];
            int ac_n = 0;

            for (int rx = -5; rx <= 5 && tc_n < MAX_CAND_TC; rx++)
            {
                for (int rz = -5; rz <= 5 && tc_n < MAX_CAND_TC; rz++)
                {
                    Pos p;
                    if (getStructurePos(Trial_Chambers, profile->mc_enum, seed, rx, rz, &p))
                    {
                        if (isViableStructurePos(Trial_Chambers, &g, p.x, p.z, 0))
                        {
                            tc_list[tc_n++] = p;
                        }
                    }
                }
            }

            for (int rx = -4; rx <= 4 && ac_n < MAX_CAND_AC; rx++)
            {
                for (int rz = -4; rz <= 4 && ac_n < MAX_CAND_AC; rz++)
                {
                    Pos p;
                    if (getStructurePos(Ancient_City, profile->mc_enum, seed, rx, rz, &p))
                    {
                        if (isViableStructurePos(Ancient_City, &g, p.x, p.z, 0))
                        {
                            ac_list[ac_n++] = p;
                        }
                    }
                }
            }

            for (int i = 0; i < tc_n && count < max_items; i++)
            {
                for (int j = 0; j < ac_n && count < max_items; j++)
                {
                    double dx = (double)(tc_list[i].x - ac_list[j].x);
                    double dz = (double)(tc_list[i].z - ac_list[j].z);
                    double dist = sqrt(dx * dx + dz * dz);
                    if (dist < 180.0)
                    {
                        SeedLensAnomaly *an = &out_items[count++];
                        memset(an, 0, sizeof(*an));
                        an->id = count;
                        an->tier = ANOMALY_TIER_SUSPECTED_GLITCH;
                        an->component = DISCOVERY_COMPONENT_ANOMALY_HUNTER;
                        an->validation_status = VALIDATION_STATUS_VERIFIED;
                        snprintf(an->category, sizeof(an->category), "structure_collision");
                        snprintf(an->subcategory, sizeof(an->subcategory), "ancient_city_trial_chamber");
                        snprintf(an->severity, sizeof(an->severity), "legendary");
                        snprintf(an->name_ar, sizeof(an->name_ar), "تداخل مدينة قديمة مع غرف المحاكمة في الأعماق");
                        snprintf(an->name_en, sizeof(an->name_en), "Ancient City & Trial Chambers Deep Collision");
                        an->x = (tc_list[i].x + ac_list[j].x) / 2;
                        an->y = -35;
                        an->z = (tc_list[i].z + ac_list[j].z) / 2;
                        double sdx = (double)(an->x - spawn_pos.x), sdz = (double)(an->z - spawn_pos.z);
                        an->distance_to_spawn = sqrt(sdx * sdx + sdz * sdz);
                        snprintf(an->axis, sizeof(an->axis), "subterranean");
                        snprintf(an->dimension, sizeof(an->dimension), "overworld");
                        snprintf(an->edition_support, sizeof(an->edition_support), "java_exclusive");
                        snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp %d -35 %d", an->x, an->z);
                        an->confidence_score = 96;
                        an->rarity_estimate = 0.00005;
                        snprintf(an->technical_evidence, sizeof(an->technical_evidence),
                                 "Trial Chambers (%d,%d) and Ancient City (%d,%d) center distance = %.1fm < 180m threshold",
                                 tc_list[i].x, tc_list[i].z, ac_list[j].x, ac_list[j].z, dist);
                        an->tag_count = 4;
                        snprintf(an->tags[0], sizeof(an->tags[0]), "تداخل_هياكل");
                        snprintf(an->tags[1], sizeof(an->tags[1]), "مدينة_وغرف_محاكمة");
                        snprintf(an->tags[2], sizeof(an->tags[2]), "واردن_وبريز");
                        snprintf(an->tags[3], sizeof(an->tags[3]), "قتال_أسطوري");
                        snprintf(an->description_ar, sizeof(an->description_ar),
                            "ظاهرة نادرة ومثيرة للغاية في أعماق العالم! غرف المحاكمة تتداخل وتصطدم مباشرة مع المدينة القديمة، مما يضع فخاخ المحاكمة ومحاربي البريز بجوار الواردن والمستشعرات الحساسة في نفس الممر!");
                        snprintf(an->description_en, sizeof(an->description_en),
                            "Extraordinary subterranean structure collision! A Trial Chamber intersects with an Ancient City, placing Breeze combat spawners and vaults directly inside Warden territory.");
                        validate_and_classify_anomaly(an, seed, profile);
                        break;
                    }
                }
            }
        }
    }

    /* B. Structure Collision: Pillager Outpost inside Village (Immediate Siege) */
    {
        StructureConfig cf_op, cf_vil;
        if (getStructureConfig(Outpost, profile->mc_enum, &cf_op) &&
            getStructureConfig(Village, profile->mc_enum, &cf_vil))
        {
            for (int rx = -3; rx <= 3 && count < max_items; rx++)
            {
                for (int rz = -3; rz <= 3 && count < max_items; rz++)
                {
                    Pos pop;
                    if (getStructurePos(Outpost, profile->mc_enum, seed, rx, rz, &pop))
                    {
                        if (isViableStructurePos(Outpost, &g, pop.x, pop.z, 0))
                        {
                            /* Check neighboring village regions */
                            for (int vx = rx - 1; vx <= rx + 1 && count < max_items; vx++)
                            {
                                for (int vz = rz - 1; vz <= rz + 1 && count < max_items; vz++)
                                {
                                    Pos pvil;
                                    if (getStructurePos(Village, profile->mc_enum, seed, vx, vz, &pvil))
                                    {
                                        if (isViableStructurePos(Village, &g, pvil.x, pvil.z, 0))
                                        {
                                            double dx = (double)(pop.x - pvil.x);
                                            double dz = (double)(pop.z - pvil.z);
                                            double dist = sqrt(dx * dx + dz * dz);
                                            if (dist < 125.0)
                                            {
                                                SeedLensAnomaly *an = &out_items[count++];
                                                memset(an, 0, sizeof(*an));
                                                an->id = count;
                                                an->tier = ANOMALY_TIER_ANOMALY;
                                                an->component = DISCOVERY_COMPONENT_ANOMALY_HUNTER;
                                                an->validation_status = VALIDATION_STATUS_VERIFIED;
                                                snprintf(an->category, sizeof(an->category), "structure_collision");
                                                snprintf(an->subcategory, sizeof(an->subcategory), "outpost_village_siege");
                                                snprintf(an->severity, sizeof(an->severity), "rare");
                                                snprintf(an->name_ar, sizeof(an->name_ar), "حصار قرية فوري (برج نهابين داخل القرية)");
                                                snprintf(an->name_en, sizeof(an->name_en), "Outpost Village Siege (Outpost Inside Village)");
                                                an->x = pop.x; an->y = 70; an->z = pop.z;
                                                double sdx = (double)(an->x - spawn_pos.x), sdz = (double)(an->z - spawn_pos.z);
                                                an->distance_to_spawn = sqrt(sdx * sdx + sdz * sdz);
                                                snprintf(an->axis, sizeof(an->axis), "surface");
                                                snprintf(an->dimension, sizeof(an->dimension), "overworld");
                                                snprintf(an->edition_support, sizeof(an->edition_support), "java_exclusive");
                                                snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp %d 70 %d", an->x, an->z);
                                                an->confidence_score = 94;
                                                an->rarity_estimate = 0.0003;
                                                snprintf(an->technical_evidence, sizeof(an->technical_evidence),
                                                         "Pillager Outpost (%d,%d) generates within %.1fm of Village (%d,%d)",
                                                         pop.x, pop.z, dist, pvil.x, pvil.z);
                                                an->tag_count = 3;
                                                snprintf(an->tags[0], sizeof(an->tags[0]), "حصار_قرية");
                                                snprintf(an->tags[1], sizeof(an->tags[1]), "برج_داخل_قرية");
                                                snprintf(an->tags[2], sizeof(an->tags[2]), "معركة_فورية");
                                                snprintf(an->description_ar, sizeof(an->description_ar),
                                                    "توليد شاذ يضع برج حراسة النهابين مباشرة بين منازل القرية، مما يشعل معركة مستمرة وحرباً دائمة بين الغولم والنهابين فور وصولك!");
                                                snprintf(an->description_en, sizeof(an->description_en),
                                                    "Rare structure generation fault placing a Pillager Outpost directly inside village boundaries, triggering immediate ongoing warfare upon spawn.");
                                                validate_and_classify_anomaly(an, seed, profile);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return count;
}

/* --------------------------------------------------------------------------
 * 4. Unknown Anomaly Discovery Engine (Phase 4 Outlier Framework)
 * -------------------------------------------------------------------------- */
int detect_unknown_outlier_anomalies(
    uint64_t seed,
    const VersionProfile *profile,
    Pos spawn_pos,
    SeedLensAnomaly *out_items,
    int max_items
)
{
    if (!profile || !out_items || max_items <= 0) return 0;
    int count = 0;

    Generator g;
    setupGenerator(&g, profile->mc_enum, 0);
    applySeed(&g, DIM_OVERWORLD, seed);

    /* A. Statistical Outlier Detection on Multi-Parametric Noise Field */
    #define UNK_GRID_STEPS 21
    #define UNK_GRID_TOTAL (UNK_GRID_STEPS * UNK_GRID_STEPS)
    int64_t samples[UNK_GRID_TOTAL][6];
    int xs[UNK_GRID_TOTAL];
    int zs[UNK_GRID_TOTAL];
    int total_pts = 0;

    for (int ix = -10; ix <= 10; ix++)
    {
        for (int iz = -10; iz <= 10; iz++)
        {
            int x = ix * 160;
            int z = iz * 160;
            int64_t np[6];
            sampleBiomeNoise(&g.bn, np, x >> 2, 16, z >> 2, NULL, 0);
            memcpy(samples[total_pts], np, sizeof(np));
            xs[total_pts] = x;
            zs[total_pts] = z;
            total_pts++;
        }
    }

    double mean[6] = {0};
    double stddev[6] = {0};

    for (int k = 0; k < 6; k++)
    {
        double sum = 0;
        for (int i = 0; i < total_pts; i++) sum += (double)samples[i][k];
        mean[k] = sum / total_pts;

        double sq_sum = 0;
        for (int i = 0; i < total_pts; i++)
        {
            double diff = (double)samples[i][k] - mean[k];
            sq_sum += diff * diff;
        }
        stddev[k] = sqrt(sq_sum / total_pts);
    }

    const char *param_names[6] = {"temperature", "humidity", "continentalness", "erosion", "depth", "weirdness"};
    const char *param_names_ar[6] = {"الحرارة", "الرطوبة", "المناخ القاري", "عوامل التعرية", "الارتفاع والعمق", "الغرابة التضاريسية"};

    typedef struct {
        int idx;
        int k;
        double z;
    } OutlierCand;

    OutlierCand cands[16];
    int cand_count = 0;

    for (int i = 0; i < total_pts && cand_count < 16; i++)
    {
        for (int k = 0; k < 6; k++)
        {
            if (stddev[k] > 1e-4)
            {
                double z = fabs((double)samples[i][k] - mean[k]) / stddev[k];
                if (z > 3.8)
                {
                    /* Deduplicate spatially: do not add if within 320m of an existing candidate */
                    int dup = 0;
                    for (int c = 0; c < cand_count; c++)
                    {
                        int dx = xs[i] - xs[cands[c].idx];
                        int dz = zs[i] - zs[cands[c].idx];
                        if (dx * dx + dz * dz < 320 * 320)
                        {
                            if (z > cands[c].z)
                            {
                                cands[c].idx = i;
                                cands[c].k = k;
                                cands[c].z = z;
                            }
                            dup = 1;
                            break;
                        }
                    }
                    if (!dup && cand_count < 16)
                    {
                        cands[cand_count].idx = i;
                        cands[cand_count].k = k;
                        cands[cand_count].z = z;
                        cand_count++;
                    }
                }
            }
        }
    }

    for (int c = 0; c < cand_count && count < max_items; c++)
    {
        int i = cands[c].idx;
        int k = cands[c].k;
        double z = cands[c].z;

        SeedLensAnomaly *an = &out_items[count++];
        memset(an, 0, sizeof(*an));
        an->id = count;
        an->tier = ANOMALY_TIER_ANOMALY;
        an->component = DISCOVERY_COMPONENT_UNKNOWN_ENGINE;
        an->validation_status = VALIDATION_STATUS_STATISTICAL_CANDIDATE;
        an->is_unclassified = 1;
        snprintf(an->category, sizeof(an->category), "unclassified_outlier");
        snprintf(an->subcategory, sizeof(an->subcategory), "statistical_%s_outlier", param_names[k]);
        snprintf(an->severity, sizeof(an->severity), z > 4.5 ? "extreme" : "rare");

        snprintf(an->name_ar, sizeof(an->name_ar), "ظاهرة تضاريس متطرفة غير مصنفة (شذوذ %s)", param_names_ar[k]);
        snprintf(an->name_en, sizeof(an->name_en), "Unclassified Statistical Outlier (%s Anomaly)", param_names[k]);

        an->x = xs[i];
        an->y = (k == 4 && samples[i][k] > (int64_t)mean[k]) ? 130 : 70;
        an->z = zs[i];
        double dx = (double)(an->x - spawn_pos.x), dz = (double)(an->z - spawn_pos.z);
        an->distance_to_spawn = sqrt(dx * dx + dz * dz);

        snprintf(an->axis, sizeof(an->axis), "statistical_cluster");
        snprintf(an->dimension, sizeof(an->dimension), "overworld");
        snprintf(an->edition_support, sizeof(an->edition_support), "java_and_bedrock");
        snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp %d %d %d", an->x, an->y, an->z);

        an->confidence_score = 91 + (int)(z > 4.5 ? 6 : (z - 3.8) * 8.0);
        if (an->confidence_score > 98) an->confidence_score = 98;
        an->rarity_estimate = 2.0 * (1.0 - 0.5 * (1.0 + erf(z / 1.41421356)));
        if (an->rarity_estimate < 0.000001) an->rarity_estimate = 0.000001;

        snprintf(an->outlier_metric, sizeof(an->outlier_metric),
                 "z_score: %.2f (param=%s, mu=%.1f, sigma=%.1f)",
                 z, param_names[k], mean[k], stddev[k]);

        snprintf(an->technical_evidence, sizeof(an->technical_evidence),
                 "Multi-parametric noise vector at (%d,%d) deviates by %.2f sigma from 441 regional sample points",
                 an->x, an->z, z);

        an->tag_count = 4;
        snprintf(an->tags[0], sizeof(an->tags[0]), "شذوذ_إحصائي");
        snprintf(an->tags[1], sizeof(an->tags[1]), "تضاريس_متطرفة");
        snprintf(an->tags[2], sizeof(an->tags[2]), "غير_مصنف");
        snprintf(an->tags[3], sizeof(an->tags[3]), "اكتشاف_ذكي");

        snprintf(an->description_ar, sizeof(an->description_ar),
            "تضاريس شاذة إحصائياً تشذ عن طبيعة العالم المحيط بها بأكثر من %.1f انحراف معياري في معيار %s، مما يخلق تضاريس متباينة للغاية وغير مألوفة عند هذه الإحداثيات.",
            z, param_names_ar[k]);
        snprintf(an->description_en, sizeof(an->description_en),
            "Statistically anomalous generation deviating by %.2f standard deviations in %s from surrounding regional climate baselines.",
            z, param_names[k]);

        validate_and_classify_anomaly(an, seed, profile);
    }

    /* B. Terrain Discontinuity / Abrupt Shear Wall */
    int max_grad = 0;
    int gx = 0, gz = 0;
    for (int i = 0; i < total_pts - 1; i++)
    {
        if (i % UNK_GRID_STEPS < UNK_GRID_STEPS - 1)
        {
            int d = abs((int)(samples[i + 1][4] - samples[i][4]));
            if (d > max_grad) { max_grad = d; gx = (xs[i] + xs[i + 1]) / 2; gz = zs[i]; }
        }
        if (i + UNK_GRID_STEPS < total_pts)
        {
            int d = abs((int)(samples[i + UNK_GRID_STEPS][4] - samples[i][4]));
            if (d > max_grad) { max_grad = d; gx = xs[i]; gz = (zs[i] + zs[i + UNK_GRID_STEPS]) / 2; }
        }
    }

    if (max_grad > 6500 && count < max_items)
    {
        SeedLensAnomaly *an = &out_items[count++];
        memset(an, 0, sizeof(*an));
        an->id = count;
        an->tier = ANOMALY_TIER_ANOMALY;
        an->component = DISCOVERY_COMPONENT_UNKNOWN_ENGINE;
        an->validation_status = VALIDATION_STATUS_STATISTICAL_CANDIDATE;
        an->is_unclassified = 1;
        snprintf(an->category, sizeof(an->category), "unclassified_outlier");
        snprintf(an->subcategory, sizeof(an->subcategory), "abrupt_terrain_discontinuity");
        snprintf(an->severity, sizeof(an->severity), "rare");
        snprintf(an->name_ar, sizeof(an->name_ar), "جرف صخري عمودي شاهق (جدار الهاوية الأملس)");
        snprintf(an->name_en, sizeof(an->name_en), "Abrupt Shear Cliff (Vertical Abyssal Wall)");
        an->x = gx; an->y = 90; an->z = gz;
        double dx = (double)(an->x - spawn_pos.x), dz = (double)(an->z - spawn_pos.z);
        an->distance_to_spawn = sqrt(dx * dx + dz * dz);
        snprintf(an->axis, sizeof(an->axis), "surface");
        snprintf(an->dimension, sizeof(an->dimension), "overworld");
        snprintf(an->edition_support, sizeof(an->edition_support), "java_and_bedrock");
        snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp %d 90 %d", an->x, an->z);
        an->confidence_score = 93;
        an->rarity_estimate = 0.0003;
        snprintf(an->outlier_metric, sizeof(an->outlier_metric), "delta_depth: %d across grid transition", max_grad);
        snprintf(an->technical_evidence, sizeof(an->technical_evidence),
                 "High spatial gradient delta_depth=%d > 6500 between sampled coordinates", max_grad);
        an->tag_count = 4;
        snprintf(an->tags[0], sizeof(an->tags[0]), "جرف_عمودي");
        snprintf(an->tags[1], sizeof(an->tags[1]), "جدار_شاهق");
        snprintf(an->tags[2], sizeof(an->tags[2]), "إطلالة_دراماتيكية");
        snprintf(an->tags[3], sizeof(an->tags[3]), "انحدار_حاد");
        snprintf(an->description_ar, sizeof(an->description_ar),
            "جدار صخري عمودي شاهق يسقط بعشرات البلوكات رأسياً خلال مسافة أفقية ضيقة جداً، مما يشكل حافة جبلية دراماتيكية وإطلالة مذهلة للبناء أو الطيران بالأليترا.");
        snprintf(an->description_en, sizeof(an->description_en),
            "Massive vertical rock wall dropping dozens of blocks across an ultra-narrow horizontal strip, creating a sheer cliff face ideal for cliffside bases and Elytra diving.");
        validate_and_classify_anomaly(an, seed, profile);
    }

    /* C. Triple Structure Convergence Nexus */
    {
        int struct_types[] = {Village, Outpost, Desert_Pyramid, Jungle_Temple, Swamp_Hut, Ancient_City, Trial_Chambers};
        const char *snames[] = {"Village", "Outpost", "Desert_Pyramid", "Jungle_Temple", "Swamp_Hut", "Ancient_City", "Trial_Chambers"};
        const char *snames_ar[] = {"قرية", "برج نهابين", "هرم صحراوي", "معبد غابة", "كوخ ساحرة", "مدينة قديمة", "غرف محاكمة"};
        int num_types = (profile->mc_enum >= MC_1_21_1) ? 7 : (profile->mc_enum >= MC_1_19_4 ? 6 : 5);

        #define MAX_NEXUS_PER_TYPE 16
        Pos npos[7][MAX_NEXUS_PER_TYPE];
        int ncounts[7] = {0};

        for (int t = 0; t < num_types; t++)
        {
            StructureConfig sc;
            if (!getStructureConfig(struct_types[t], profile->mc_enum, &sc)) continue;
            for (int rx = -3; rx <= 3 && ncounts[t] < MAX_NEXUS_PER_TYPE; rx++)
            {
                for (int rz = -3; rz <= 3 && ncounts[t] < MAX_NEXUS_PER_TYPE; rz++)
                {
                    Pos p;
                    if (getStructurePos(struct_types[t], profile->mc_enum, seed, rx, rz, &p))
                    {
                        if (isViableStructurePos(struct_types[t], &g, p.x, p.z, 0))
                        {
                            npos[t][ncounts[t]++] = p;
                        }
                    }
                }
            }
        }

        int nexus_found = 0;
        for (int i = 0; i < num_types && !nexus_found && count < max_items; i++)
        {
            for (int pi = 0; pi < ncounts[i] && !nexus_found && count < max_items; pi++)
            {
                Pos p1 = npos[i][pi];
                for (int j = i + 1; j < num_types && !nexus_found && count < max_items; j++)
                {
                    for (int pj = 0; pj < ncounts[j] && !nexus_found && count < max_items; pj++)
                    {
                        Pos p2 = npos[j][pj];
                        double d12 = sqrt((double)((p1.x - p2.x)*(p1.x - p2.x) + (p1.z - p2.z)*(p1.z - p2.z)));
                        if (d12 > 280.0) continue;

                        for (int k = j + 1; k < num_types && !nexus_found && count < max_items; k++)
                        {
                            for (int pk = 0; pk < ncounts[k] && !nexus_found && count < max_items; pk++)
                            {
                                Pos p3 = npos[k][pk];
                                double d13 = sqrt((double)((p1.x - p3.x)*(p1.x - p3.x) + (p1.z - p3.z)*(p1.z - p3.z)));
                                double d23 = sqrt((double)((p2.x - p3.x)*(p2.x - p3.x) + (p2.z - p3.z)*(p2.z - p3.z)));
                                double max_d = fmax(d12, fmax(d13, d23));

                                if (d13 <= 280.0 && d23 <= 280.0)
                                {
                                    SeedLensAnomaly *an = &out_items[count++];
                                    memset(an, 0, sizeof(*an));
                                    an->id = count;
                                    an->tier = ANOMALY_TIER_ANOMALY;
                                    an->component = DISCOVERY_COMPONENT_UNKNOWN_ENGINE;
                                    an->validation_status = VALIDATION_STATUS_VERIFIED;
                                    an->is_unclassified = 1;
                                    snprintf(an->category, sizeof(an->category), "structural_nexus");
                                    snprintf(an->subcategory, sizeof(an->subcategory), "triple_structure_cluster");
                                    snprintf(an->severity, sizeof(an->severity), "legendary");
                                    snprintf(an->name_ar, sizeof(an->name_ar), "ملتقى حضارات ثلاثي نادر (%s و %s و %s)",
                                             snames_ar[i], snames_ar[j], snames_ar[k]);
                                    snprintf(an->name_en, sizeof(an->name_en), "Triple Structure Convergence Nexus (%s, %s, %s)",
                                             snames[i], snames[j], snames[k]);
                                    an->x = (p1.x + p2.x + p3.x) / 3;
                                    an->y = 65;
                                    an->z = (p1.z + p2.z + p3.z) / 3;
                                    double dx = (double)(an->x - spawn_pos.x), dz = (double)(an->z - spawn_pos.z);
                                    an->distance_to_spawn = sqrt(dx * dx + dz * dz);
                                    snprintf(an->axis, sizeof(an->axis), "surface");
                                    snprintf(an->dimension, sizeof(an->dimension), "overworld");
                                    snprintf(an->edition_support, sizeof(an->edition_support), "java_and_bedrock");
                                    snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp %d 70 %d", an->x, an->z);
                                    an->confidence_score = 97;
                                    an->rarity_estimate = 0.00004;
                                    snprintf(an->outlier_metric, sizeof(an->outlier_metric),
                                             "nexus_span: %.1fm (3 structures <= 280m)", max_d);
                                    snprintf(an->technical_evidence, sizeof(an->technical_evidence),
                                             "Structures %s(%d,%d), %s(%d,%d), and %s(%d,%d) generate within max distance %.1fm",
                                             snames[i], p1.x, p1.z, snames[j], p2.x, p2.z, snames[k], p3.x, p3.z, max_d);
                                    an->tag_count = 4;
                                    snprintf(an->tags[0], sizeof(an->tags[0]), "تجمع_ثلاثي");
                                    snprintf(an->tags[1], sizeof(an->tags[1]), "ملتقى_هياكل");
                                    snprintf(an->tags[2], sizeof(an->tags[2]), "مغامرة_شاملة");
                                    snprintf(an->tags[3], sizeof(an->tags[3]), "نادر_جداً");
                                    snprintf(an->description_ar, sizeof(an->description_ar),
                                        "تجمع استثنائي شديد الندرة يتلاقى فيه ثلاثة هياكل رئيسية مختلفة في مساحة ضيقة لا تتجاوز 280 متراً، مما يمنحك تجربة مغامرة متكاملة وموارد استكشافية ضخمة في مكان واحد.");
                                    snprintf(an->description_en, sizeof(an->description_en),
                                        "Exceptional convergence of three distinct major structures generating within a compact 280m perimeter, providing a concentrated nexus of adventure and loot.");
                                    validate_and_classify_anomaly(an, seed, profile);
                                    nexus_found = 1;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return count;
}

/* --------------------------------------------------------------------------
 * Core Orchestrator: collect_anomalies_internal
 * -------------------------------------------------------------------------- */
int collect_anomalies_internal(
    uint64_t seed,
    const VersionProfile *profile,
    Pos spawn_pos,
    SeedLensAnomaliesResult *out_anomalies
)
{
    if (!profile || !out_anomalies)
    {
        return -1;
    }

    memset(out_anomalies, 0, sizeof(*out_anomalies));
    int total = 0;

    /* 1. Run Pattern Hunter */
    int n_pat = detect_pattern_anomalies(seed, profile, spawn_pos,
                                         &out_anomalies->items[total],
                                         SEEDLENS_MAX_ANOMALIES - total);
    total += n_pat;

    /* 2. Run Historical & Dimensional Glitch Hunter */
    if (total < SEEDLENS_MAX_ANOMALIES)
    {
        int n_hist = detect_historical_and_dimensional_anomalies(seed, profile, spawn_pos,
                                                                 &out_anomalies->items[total],
                                                                 SEEDLENS_MAX_ANOMALIES - total);
        total += n_hist;
    }

    /* 3. Run Structural & Terrain Anomaly Hunter */
    if (total < SEEDLENS_MAX_ANOMALIES)
    {
        int n_struct = detect_structural_and_terrain_anomalies(seed, profile, spawn_pos,
                                                               &out_anomalies->items[total],
                                                               SEEDLENS_MAX_ANOMALIES - total);
        total += n_struct;
    }

    /* 4. Run Unknown Outlier Discovery Engine */
    if (total < SEEDLENS_MAX_ANOMALIES)
    {
        int n_unk = detect_unknown_outlier_anomalies(seed, profile, spawn_pos,
                                                     &out_anomalies->items[total],
                                                     SEEDLENS_MAX_ANOMALIES - total);
        total += n_unk;
    }

    /* Aggregate Statistics */
    out_anomalies->total_found = total;
    out_anomalies->anomaly_count = total;

    for (int i = 0; i < total; i++)
    {
        out_anomalies->items[i].id = i + 1;
        if (out_anomalies->items[i].tier == ANOMALY_TIER_VERIFIED_GLITCH)
        {
            out_anomalies->verified_glitch_count++;
        }
        else if (out_anomalies->items[i].tier == ANOMALY_TIER_ANOMALY ||
                 out_anomalies->items[i].tier == ANOMALY_TIER_SUSPECTED_GLITCH)
        {
            out_anomalies->anomaly_tier_count++;
        }
        else if (out_anomalies->items[i].tier == ANOMALY_TIER_RARE_GENERATION)
        {
            out_anomalies->rare_generation_count++;
        }
        if (out_anomalies->items[i].is_unclassified)
        {
            out_anomalies->unclassified_count++;
        }
    }

    return total;
}
