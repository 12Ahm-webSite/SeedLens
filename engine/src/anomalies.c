#include "internal.h"
#include <math.h>

/*
 * SeedLens Worldgen Anomalies & Glitched Seeds Engine (v4.5)
 * Detects mathematical generation anomalies, PRNG structure repetitions,
 * void End islands, and broken worldgen features without altering Useful v3.1 scoring.
 */

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
    int count = 0;

    /* -------------------------------------------------------------
     * 1. Infinite Repeating Mineshafts (PRNG Axis Degeneracy)
     * -------------------------------------------------------------
     * In Minecraft Java Edition:
     *   setSeed(&s, seed);
     *   uint64_t a = nextLong(&s);
     *   uint64_t b = nextLong(&s);
     * Chunk seed at (i, j) is: (i * a ^ seed) ^ (j * b)
     * If a == 0, then for all chunks along j = 0 (Z=0 axis),
     * the chunk seed collapses to the world seed itself.
     * If nextDouble(seed) < 0.004, a mineshaft generates in EVERY
     * single chunk from -infinity to +infinity along the X-axis!
     * (Verified in seed 107038380838084).
     */
    uint64_t s;
    setSeed(&s, seed);
    uint64_t a = nextLong(&s);
    uint64_t b = nextLong(&s);

    int is_infinite_x = 0;
    int is_infinite_z = 0;

    if (a == 0)
    {
        setSeed(&s, seed);
        if (nextDouble(&s) < 0.004)
        {
            is_infinite_x = 1;
        }
    }

    if (b == 0)
    {
        setSeed(&s, seed);
        if (nextDouble(&s) < 0.004)
        {
            is_infinite_z = 1;
        }
    }

    if (is_infinite_x && count < SEEDLENS_MAX_ANOMALIES)
    {
        SeedLensAnomaly *an = &out_anomalies->items[count++];
        an->id = count;
        snprintf(an->category, sizeof(an->category), "infinite_repeating_mineshaft");
        snprintf(an->severity, sizeof(an->severity), "legendary");
        snprintf(an->name_ar, sizeof(an->name_ar), "قلتش المناجم اللانهائية تحت الـ Spawn مباشرة (المحور X)");
        snprintf(an->name_en, sizeof(an->name_en), "Infinite Repeating Mineshafts (X-Axis)");
        an->x = 0;
        an->y = 24;
        an->z = 0;
        double dx = (double)(an->x - spawn_pos.x);
        double dz = (double)(an->z - spawn_pos.z);
        an->distance_to_spawn = sqrt(dx * dx + dz * dz);
        snprintf(an->axis, sizeof(an->axis), "x_axis");
        snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp 0 24 0");
        an->confidence_score = 100;
        an->tag_count = 4;
        snprintf(an->tags[0], sizeof(an->tags[0]), "مناجم_لانهائية");
        snprintf(an->tags[1], sizeof(an->tags[1]), "موارد_بلا_نهاية");
        snprintf(an->tags[2], sizeof(an->tags[2]), "تحت_السباون");
        snprintf(an->tags[3], sizeof(an->tags[3]), "قلتش_أسطوري");
        snprintf(an->description_ar, sizeof(an->description_ar),
            "قلتش أسطوري تحت نقطة البداية! بمجرد أن تحفر لأسفل ستجد شبكة خشبية عملاقة من المناجم وسكك الحديد ممتدة بلا نهاية باتجاه الشرق والغرب، تمنحك سكك وخشب وصناديق موارد لا تنتهي أبداً.");
        snprintf(an->description_en, sizeof(an->description_en),
            "Legendary worldgen glitch right beneath spawn! Dig straight down to discover an endless labyrinth of wooden mineshafts and rails stretching into infinity along the X-axis (East-West), offering unlimited minecarts, loot chests, and timber.");
    }
    else if (is_infinite_z && count < SEEDLENS_MAX_ANOMALIES)
    {
        SeedLensAnomaly *an = &out_anomalies->items[count++];
        an->id = count;
        snprintf(an->category, sizeof(an->category), "infinite_repeating_mineshaft");
        snprintf(an->severity, sizeof(an->severity), "legendary");
        snprintf(an->name_ar, sizeof(an->name_ar), "قلتش المناجم اللانهائية تحت الـ Spawn مباشرة (المحور Z)");
        snprintf(an->name_en, sizeof(an->name_en), "Infinite Repeating Mineshafts (Z-Axis)");
        an->x = 0;
        an->y = 24;
        an->z = 0;
        double dx = (double)(an->x - spawn_pos.x);
        double dz = (double)(an->z - spawn_pos.z);
        an->distance_to_spawn = sqrt(dx * dx + dz * dz);
        snprintf(an->axis, sizeof(an->axis), "z_axis");
        snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp 0 24 0");
        an->confidence_score = 100;
        an->tag_count = 4;
        snprintf(an->tags[0], sizeof(an->tags[0]), "مناجم_لانهائية");
        snprintf(an->tags[1], sizeof(an->tags[1]), "موارد_بلا_نهاية");
        snprintf(an->tags[2], sizeof(an->tags[2]), "تحت_السباون");
        snprintf(an->tags[3], sizeof(an->tags[3]), "قلتش_أسطوري");
        snprintf(an->description_ar, sizeof(an->description_ar),
            "قلتش أسطوري تحت نقطة البداية! بمجرد أن تحفر لأسفل ستجد شبكة خشبية عملاقة من المناجم وسكك الحديد ممتدة بلا نهاية باتجاه الشمال والجنوب، تمنحك سكك وخشب وصناديق موارد لا تنتهي أبداً.");
        snprintf(an->description_en, sizeof(an->description_en),
            "Legendary worldgen glitch right beneath spawn! Dig straight down to discover an endless labyrinth of wooden mineshafts and rails stretching into infinity along the Z-axis (North-South), offering unlimited minecarts, loot chests, and timber.");
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
        if (max_consecutive >= 6 && count < SEEDLENS_MAX_ANOMALIES)
        {
            SeedLensAnomaly *an = &out_anomalies->items[count++];
            an->id = count;
            snprintf(an->category, sizeof(an->category), "dense_mineshaft_corridor");
            snprintf(an->severity, sizeof(an->severity), "rare");
            snprintf(an->name_ar, sizeof(an->name_ar), "ممر مناجم متصل فائق الكثافة");
            snprintf(an->name_en, sizeof(an->name_en), "Dense Contiguous Mineshaft Corridor");
            an->x = 0;
            an->y = 28;
            an->z = 0;
            double dx = (double)(an->x - spawn_pos.x);
            double dz = (double)(an->z - spawn_pos.z);
            an->distance_to_spawn = sqrt(dx * dx + dz * dz);
            snprintf(an->axis, sizeof(an->axis), "x_axis");
            snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp 0 28 0");
            an->confidence_score = 92;
            an->tag_count = 3;
            snprintf(an->tags[0], sizeof(an->tags[0]), "dense_mineshafts");
            snprintf(an->tags[1], sizeof(an->tags[1]), "subterranean");
            snprintf(an->tags[2], sizeof(an->tags[2]), "rare_worldgen");
            snprintf(an->description_ar, sizeof(an->description_ar),
                "تجمع نادر وغير اعتيادي لمناجم خشبية متصلة على عدة تشانكات متتالية في خط مستقيم.");
            snprintf(an->description_en, sizeof(an->description_en),
                "Rare generation quirk with multiple contiguous mineshafts aligned in a dense subterranean sequence.");
        }
    }

    /* -------------------------------------------------------------
     * 2. Void Main End Island (MC-267423 Terrain Density Glitch)
     * -------------------------------------------------------------
     * On specific seeds (such as 7593177223396, 8994765102493, etc.),
     * the procedural noise governing the central End island fails to
     * reach the positive density threshold for solid End stone.
     * The island mass fails to generate completely, leaving the
     * exit portal, obsidian spikes, crystals, and Ender Dragon
     * suspended in mid-air over the bottomless void!
     */
    if (seed == 7593177223396ULL ||
        seed == 8994765102493ULL ||
        seed == 32896149644487ULL ||
        seed == 45459229772041ULL ||
        seed == 3430588ULL)
    {
        if (count < SEEDLENS_MAX_ANOMALIES)
        {
            SeedLensAnomaly *an = &out_anomalies->items[count++];
            an->id = count;
            snprintf(an->category, sizeof(an->category), "void_end_island");
            snprintf(an->severity, sizeof(an->severity), "legendary");
            snprintf(an->name_ar, sizeof(an->name_ar), "عالم الإند المفرغ (قتال التنين فوق الفراغ السحيق)");
            snprintf(an->name_en, sizeof(an->name_en), "Void Main End Island (Floating Dragon Arena)");
            an->x = 0;
            an->y = 64;
            an->z = 0;
            an->distance_to_spawn = 0.0;
            snprintf(an->axis, sizeof(an->axis), "dimension_end");
            snprintf(an->teleport_command, sizeof(an->teleport_command),
                     "/execute in minecraft:the_end run tp 0 64 0");
            an->confidence_score = 100;
            an->tag_count = 4;
            snprintf(an->tags[0], sizeof(an->tags[0]), "إند_فارغ");
            snprintf(an->tags[1], sizeof(an->tags[1]), "تنين_في_الفويد");
            snprintf(an->tags[2], sizeof(an->tags[2]), "تحدي_مستحيل");
            snprintf(an->tags[3], sizeof(an->tags[3]), "بدون_أرضية");
            snprintf(an->description_ar, sizeof(an->description_ar),
                "قلتش شهير (MC-267423) يمسح أرضية الإند تماماً! لن تجد أي حجر إند تحت قدميك؛ التنين وأعمدة الأوبسيديان وبوابة الخروج تطفو في الفراغ المطلق. (انتبه: ستقع فوراً في الفويد إذا لم تبنِ جسراً أو ترمِ إندر بيرل بمجرد دخولك البوابة!)");
            snprintf(an->description_en, sizeof(an->description_en),
                "Iconic Minecraft worldgen bug (MC-267423): End Stone terrain completely fails to generate at (0,0), leaving the Ender Dragon, obsidian pillars, and exit portal floating above the bottomless void! (Warning: You will drop into the void immediately upon entering unless you bridge or pearl)");
        }
    }

    /* -------------------------------------------------------------
     * 3. Repeating Coordinate / Monolithic Terrain Glitch
     * -------------------------------------------------------------
     * Known seeds with 2D repeating monolithic chunks (such as 1643112).
     */
    if (seed == 1643112ULL && count < SEEDLENS_MAX_ANOMALIES)
    {
        SeedLensAnomaly *an = &out_anomalies->items[count++];
        an->id = count;
        snprintf(an->category, sizeof(an->category), "repeating_terrain_glitch");
        snprintf(an->severity, sizeof(an->severity), "extreme");
        snprintf(an->name_ar, sizeof(an->name_ar), "تضاريس مستنسخة ومكررة إلى ما لا نهاية");
        snprintf(an->name_en, sizeof(an->name_en), "Infinite Repeating Terrain Grid");
        an->x = 0;
        an->y = 70;
        an->z = 0;
        double dx = (double)(an->x - spawn_pos.x);
        double dz = (double)(an->z - spawn_pos.z);
        an->distance_to_spawn = sqrt(dx * dx + dz * dz);
        snprintf(an->axis, sizeof(an->axis), "x_axis");
        snprintf(an->teleport_command, sizeof(an->teleport_command), "/tp 0 70 0");
        an->confidence_score = 98;
        an->tag_count = 4;
        snprintf(an->tags[0], sizeof(an->tags[0]), "تضاريس_مستنسخة");
        snprintf(an->tags[1], sizeof(an->tags[1]), "عالم_متكرر");
        snprintf(an->tags[2], sizeof(an->tags[2]), "مرايا_التوليد");
        snprintf(an->tags[3], sizeof(an->tags[3]), "قلتش_أسطوري");
        snprintf(an->description_ar, sizeof(an->description_ar),
            "قلتش أسطوري في العالم! ينسخ نفس الجبال والكهوف والتضاريس كأنها مرايا مكررة تمتد في خط مستقيم بلا نهاية؛ ستجد نفس الجبل والتشكيل الصخري يتكرر أمامك بالكامل كل بضع خطوات وأنت تمشي.");
        snprintf(an->description_en, sizeof(an->description_en),
            "Legendary worldgen glitch! Identical slices of mountains, caves, and terrain are copied endlessly like mirrors in a straight line; the exact same peak and valley repeats before your eyes every few blocks as you travel.");
    }

    out_anomalies->total_found = count;
    out_anomalies->anomaly_count = count;
    return count;
}

