#include "internal.h"
#include "util.h"
#include <math.h>

#define LANDMARKS_SCAN_RADIUS 4850
#define LANDMARKS_SCAN_STEP 120
#define MAX_CANDIDATE_LANDMARKS 256

static int is_peak_biome(int b)
{
    return (b == jagged_peaks || b == frozen_peaks || b == stony_peaks ||
            b == snowy_slopes || b == meadow || b == grove);
}

static int is_high_peak_biome(int b)
{
    return (b == jagged_peaks || b == frozen_peaks || b == stony_peaks || b == snowy_slopes);
}

static int is_ocean_biome(int b)
{
    return (b == ocean || b == deep_ocean || b == warm_ocean || b == lukewarm_ocean ||
            b == cold_ocean || b == deep_cold_ocean || b == deep_frozen_ocean ||
            b == deep_lukewarm_ocean || b == frozen_ocean);
}

static int is_building_biome(int b)
{
    return (b == plains || b == sunflower_plains || b == meadow ||
            b == forest || b == flower_forest || b == savanna);
}

static void add_unique_surrounding_biome(SeedLensLandmark *lm, const char *biome_name)
{
    if (!biome_name || lm->surrounding_biome_count >= 4)
    {
        return;
    }
    for (int i = 0; i < lm->surrounding_biome_count; i++)
    {
        if (strcmp(lm->surrounding_biomes[i], biome_name) == 0)
        {
            return;
        }
    }
    snprintf(lm->surrounding_biomes[lm->surrounding_biome_count],
             sizeof(lm->surrounding_biomes[0]), "%s", biome_name);
    lm->surrounding_biome_count++;
}

int collect_landmarks_internal(
    uint64_t seed,
    const VersionProfile *profile,
    Pos spawn_pos,
    SeedLensLandmarksResult *out_landmarks
)
{
    if (!profile || !out_landmarks)
    {
        return 0;
    }

    memset(out_landmarks, 0, sizeof(*out_landmarks));

    Generator g;
    setupGenerator(&g, profile->mc_enum, 0);
    applySeed(&g, DIM_OVERWORLD, seed);

    static SeedLensLandmark candidates[MAX_CANDIDATE_LANDMARKS];
    int candidate_count = 0;

    for (int z = -LANDMARKS_SCAN_RADIUS; z <= LANDMARKS_SCAN_RADIUS; z += LANDMARKS_SCAN_STEP)
    {
        for (int x = -LANDMARKS_SCAN_RADIUS; x <= LANDMARKS_SCAN_RADIUS; x += LANDMARKS_SCAN_STEP)
        {
            if (x * x + z * z > LANDMARKS_SCAN_RADIUS * LANDMARKS_SCAN_RADIUS)
            {
                continue;
            }

            int64_t np[6];
            int b_surf = sampleBiomeNoise(&g.bn, np, x >> 2, 16, z >> 2, NULL, 0);
            int b_peak = sampleBiomeNoise(&g.bn, np, x >> 2, 35, z >> 2, NULL, 0);

            int is_candidate = 0;
            SeedLensLandmark spot;
            memset(&spot, 0, sizeof(spot));

            /* 1. Cherry Caldera or Cherry Grove Highland */
            if (b_surf == cherry_grove || b_peak == cherry_grove)
            {
                int peak_count = 0;
                for (int a = 0; a < 8; a++)
                {
                    double rad = (double)a * 45.0 * M_PI / 180.0;
                    int sx = x + (int)(200.0 * cos(rad));
                    int sz = z + (int)(200.0 * sin(rad));
                    int bs = sampleBiomeNoise(&g.bn, np, sx >> 2, 35, sz >> 2, NULL, 0);
                    if (is_peak_biome(bs))
                    {
                        peak_count++;
                    }
                    const char *s_name = biome2str(profile->mc_enum, bs);
                    if (s_name)
                    {
                        add_unique_surrounding_biome(&spot, s_name);
                    }
                }

                if (peak_count >= 4)
                {
                    snprintf(spot.category, sizeof(spot.category), "cherry_caldera");
                    snprintf(spot.name_ar, sizeof(spot.name_ar), "فوهة كرز جبلية");
                    snprintf(spot.name_en, sizeof(spot.name_en), "Cherry Blossom Caldera");
                    spot.scenic_score = 92 + (peak_count > 6 ? 6 : peak_count);
                    spot.building_score = 86 + (peak_count >= 5 ? 4 : 0);
                    spot.y = 136;
                    snprintf(spot.tags[0], sizeof(spot.tags[0]), "cherry_blossom");
                    snprintf(spot.tags[1], sizeof(spot.tags[1]), "mountain_ring");
                    snprintf(spot.tags[2], sizeof(spot.tags[2]), "scenic_valley");
                    spot.tag_count = 3;
                    snprintf(spot.description_ar, sizeof(spot.description_ar),
                             "منخفض طبيعي دائري محاط بسلسلة قمم جبلية شاهقة تكسوه أزهار الكرز الوردية؛ موقع ساحر لبناء قلعة جبلية وأخذ لقطات شاشة بانورامية.");
                    snprintf(spot.description_en, sizeof(spot.description_en),
                             "Enclosed mountain caldera ringed by snowy peaks and carpeted in cherry blossoms. Superb panoramic vista and secluded base location.");
                }
                else
                {
                    snprintf(spot.category, sizeof(spot.category), "cherry_grove");
                    snprintf(spot.name_ar, sizeof(spot.name_ar), "بستان كرز جبلي");
                    snprintf(spot.name_en, sizeof(spot.name_en), "Cherry Blossom Highland");
                    spot.scenic_score = 88;
                    spot.building_score = 82;
                    spot.y = 120;
                    snprintf(spot.tags[0], sizeof(spot.tags[0]), "cherry_blossom");
                    snprintf(spot.tags[1], sizeof(spot.tags[1]), "highland");
                    snprintf(spot.tags[2], sizeof(spot.tags[2]), "pink_canopy");
                    spot.tag_count = 3;
                    snprintf(spot.description_ar, sizeof(spot.description_ar),
                             "مرتفعات خلابة من بساتين الكرز المفتوحة على تلال خضراء؛ إطلالة طبيعية مبهجة ومثالية لتأسيس قرية هادئة.");
                    snprintf(spot.description_en, sizeof(spot.description_en),
                             "Elevated cherry grove plateau with rolling floral slopes. Ideal open landscape for scenic builds and village outposts.");
                }

                const char *pb = biome2str(profile->mc_enum, cherry_grove);
                snprintf(spot.primary_biome, sizeof(spot.primary_biome), "%s", pb ? pb : "cherry_grove");
                is_candidate = 1;
            }

            /* 2. Mountain Crater (Meadow or Plains enclosed by high peaks) */
            else if (b_surf == meadow || b_surf == plains)
            {
                int high_peaks = 0;
                for (int a = 0; a < 8; a++)
                {
                    double rad = (double)a * 45.0 * M_PI / 180.0;
                    int sx = x + (int)(220.0 * cos(rad));
                    int sz = z + (int)(220.0 * sin(rad));
                    int bs = sampleBiomeNoise(&g.bn, np, sx >> 2, 35, sz >> 2, NULL, 0);
                    if (is_high_peak_biome(bs))
                    {
                        high_peaks++;
                    }
                    const char *s_name = biome2str(profile->mc_enum, bs);
                    if (s_name)
                    {
                        add_unique_surrounding_biome(&spot, s_name);
                    }
                }

                if (high_peaks >= 4)
                {
                    snprintf(spot.category, sizeof(spot.category), "mountain_crater");
                    snprintf(spot.name_ar, sizeof(spot.name_ar), "فوهة جبلية محاطة بقمم");
                    snprintf(spot.name_en, sizeof(spot.name_en), "Mountain Crater Ring");
                    spot.scenic_score = 91 + (high_peaks > 6 ? 6 : high_peaks);
                    spot.building_score = 90 + (high_peaks >= 6 ? 5 : 0);
                    spot.y = 118;
                    snprintf(spot.tags[0], sizeof(spot.tags[0]), "crater_ring");
                    snprintf(spot.tags[1], sizeof(spot.tags[1]), "secluded_valley");
                    snprintf(spot.tags[2], sizeof(spot.tags[2]), "natural_fortress");
                    spot.tag_count = 3;
                    snprintf(spot.description_ar, sizeof(spot.description_ar),
                             "وادٍ فسيح محمي بحلقة كاملة من القمم الحجرية والمثلجة؛ تشكيل تضاريسي نادر يمنح حماية طبيعية وإطلالة خيالية للقواعد الضخمة.");
                    snprintf(spot.description_en, sizeof(spot.description_en),
                             "Hidden alpine crater enclosed by towering jagged peaks. Offers natural fortification and awe-inspiring landscape for megabases.");

                    const char *pb = biome2str(profile->mc_enum, b_surf);
                    snprintf(spot.primary_biome, sizeof(spot.primary_biome), "%s", pb ? pb : "meadow");
                    is_candidate = 1;
                }
            }

            /* 3. Epic Clifftop / Vista (Windswept Savanna / Extreme Cliffs) */
            if (!is_candidate && (b_surf == windswept_savanna || b_surf == windswept_hills || b_peak == jagged_peaks))
            {
                int low_drop = 0;
                for (int a = 0; a < 8; a++)
                {
                    double rad = (double)a * 45.0 * M_PI / 180.0;
                    int sx = x + (int)(160.0 * cos(rad));
                    int sz = z + (int)(160.0 * sin(rad));
                    int bs = sampleBiomeNoise(&g.bn, np, sx >> 2, 16, sz >> 2, NULL, 0);
                    if (is_ocean_biome(bs) || bs == plains || bs == beach || bs == river)
                    {
                        low_drop++;
                    }
                    const char *s_name = biome2str(profile->mc_enum, bs);
                    if (s_name)
                    {
                        add_unique_surrounding_biome(&spot, s_name);
                    }
                }

                if (low_drop >= 3)
                {
                    snprintf(spot.category, sizeof(spot.category), "epic_clifftop");
                    snprintf(spot.name_ar, sizeof(spot.name_ar), "جرف بانورامي شاهق");
                    snprintf(spot.name_en, sizeof(spot.name_en), "Epic Clifftop Vista");
                    spot.scenic_score = 95;
                    spot.building_score = 76;
                    spot.y = 155;
                    snprintf(spot.tags[0], sizeof(spot.tags[0]), "extreme_drop");
                    snprintf(spot.tags[1], sizeof(spot.tags[1]), "ocean_vista");
                    snprintf(spot.tags[2], sizeof(spot.tags[2]), "floating_terrain");
                    spot.tag_count = 3;
                    snprintf(spot.description_ar, sizeof(spot.description_ar),
                             "جرف صخري حاد يرتفع أكثر من 80 بلوكاً فوق السهول أو المحيط؛ موقع مهيب لالتقاط سكرين شوت مذهل أو بناء جسور معلقة وقلاع سحابية.");
                    snprintf(spot.description_en, sizeof(spot.description_en),
                             "Dramatic sheer cliff rising over 80 blocks above coastal waters. Exceptional dramatic vista for suspension bridges and aerial fortresses.");

                    const char *pb = biome2str(profile->mc_enum, b_surf);
                    snprintf(spot.primary_biome, sizeof(spot.primary_biome), "%s", pb ? pb : "windswept_savanna");
                    is_candidate = 1;
                }
            }

            /* 4. Prime Building Basin (Flat fertile land with river/water access) */
            if (!is_candidate && (b_surf == plains || b_surf == sunflower_plains || b_surf == meadow))
            {
                int build_count = 0;
                int water_access = 0;
                for (int a = 0; a < 8; a++)
                {
                    double rad = (double)a * 45.0 * M_PI / 180.0;
                    int sx = x + (int)(120.0 * cos(rad));
                    int sz = z + (int)(120.0 * sin(rad));
                    int bs = sampleBiomeNoise(&g.bn, np, sx >> 2, 16, sz >> 2, NULL, 0);
                    if (is_building_biome(bs))
                    {
                        build_count++;
                    }
                    if (bs == river || is_ocean_biome(bs) || bs == beach)
                    {
                        water_access = 1;
                    }
                    const char *s_name = biome2str(profile->mc_enum, bs);
                    if (s_name)
                    {
                        add_unique_surrounding_biome(&spot, s_name);
                    }
                }

                if (build_count >= 7 && water_access)
                {
                    snprintf(spot.category, sizeof(spot.category), "prime_building_basin");
                    snprintf(spot.name_ar, sizeof(spot.name_ar), "حوض بناء مستوٍ واسع");
                    snprintf(spot.name_en, sizeof(spot.name_en), "Prime Building Basin");
                    spot.scenic_score = 80;
                    spot.building_score = 96;
                    spot.y = 66;
                    snprintf(spot.tags[0], sizeof(spot.tags[0]), "flat_terrain");
                    snprintf(spot.tags[1], sizeof(spot.tags[1]), "waterfront");
                    snprintf(spot.tags[2], sizeof(spot.tags[2]), "fertile");
                    spot.tag_count = 3;
                    snprintf(spot.description_ar, sizeof(spot.description_ar),
                             "أرض مستوية واسعة وقليلة الانحدار ومحاطة بمجرى مائي وموارد غابية؛ المكان المثالي لتأسيس مدينة كبرى أو مزارع واسعة دون عناء تسوية الأرض.");
                    snprintf(spot.description_en, sizeof(spot.description_en),
                             "Vast flat terrain adjacent to water and forest resources. Optimal building conditions for sprawling cities and farms without terraforming.");

                    const char *pb = biome2str(profile->mc_enum, b_surf);
                    snprintf(spot.primary_biome, sizeof(spot.primary_biome), "%s", pb ? pb : "plains");
                    is_candidate = 1;
                }
            }

            /* 5. Isolated Survival Island */
            if (!is_candidate && !is_ocean_biome(b_surf))
            {
                int ocean_count = 0;
                for (int a = 0; a < 8; a++)
                {
                    double rad = (double)a * 45.0 * M_PI / 180.0;
                    int sx = x + (int)(250.0 * cos(rad));
                    int sz = z + (int)(250.0 * sin(rad));
                    int bs = sampleBiomeNoise(&g.bn, np, sx >> 2, 16, sz >> 2, NULL, 0);
                    if (is_ocean_biome(bs))
                    {
                        ocean_count++;
                    }
                    const char *s_name = biome2str(profile->mc_enum, bs);
                    if (s_name)
                    {
                        add_unique_surrounding_biome(&spot, s_name);
                    }
                }

                if (ocean_count >= 7)
                {
                    snprintf(spot.category, sizeof(spot.category), "isolated_island");
                    snprintf(spot.name_ar, sizeof(spot.name_ar), "جزيرة نجاة معزولة");
                    snprintf(spot.name_en, sizeof(spot.name_en), "Isolated Survival Island");
                    spot.scenic_score = 87;
                    spot.building_score = 83;
                    spot.y = 64;
                    snprintf(spot.tags[0], sizeof(spot.tags[0]), "isolated");
                    snprintf(spot.tags[1], sizeof(spot.tags[1]), "ocean_sanctuary");
                    snprintf(spot.tags[2], sizeof(spot.tags[2]), "island_survival");
                    spot.tag_count = 3;
                    snprintf(spot.description_ar, sizeof(spot.description_ar),
                             "جزيرة طبيعية معزولة محاطة بالمحيط العميق من كافة الجهات؛ بيئة استثنائية لعشاق تحديات النجاة في جزر نائية وبناء منارات ساحلية.");
                    snprintf(spot.description_en, sizeof(spot.description_en),
                             "Secluded survival island encircled by deep ocean waters. Prime choice for hardcore island survival, lighthouses, and oceanic retreats.");

                    const char *pb = biome2str(profile->mc_enum, b_surf);
                    snprintf(spot.primary_biome, sizeof(spot.primary_biome), "%s", pb ? pb : "island");
                    is_candidate = 1;
                }
            }

            /* 6. Pale Garden (1.21.4+ / Winter Drop) */
            if (!is_candidate && b_surf == pale_garden)
            {
                snprintf(spot.category, sizeof(spot.category), "pale_garden");
                snprintf(spot.name_ar, sizeof(spot.name_ar), "الحديقة الشاحبة الغامضة");
                snprintf(spot.name_en, sizeof(spot.name_en), "Eerie Pale Garden");
                spot.scenic_score = 93;
                spot.building_score = 81;
                spot.y = 70;
                snprintf(spot.tags[0], sizeof(spot.tags[0]), "pale_garden");
                snprintf(spot.tags[1], sizeof(spot.tags[1]), "creaking");
                snprintf(spot.tags[2], sizeof(spot.tags[2]), "atmospheric");
                spot.tag_count = 3;
                snprintf(spot.description_ar, sizeof(spot.description_ar),
                         "غابة الحديقة الشاحبة ذات الأجواء الرمادية الكئيبة؛ مظهر بصري مهيب وفريد لأصحاب التصاميم القوطية والقواعد الغامضة.");
                snprintf(spot.description_en, sizeof(spot.description_en),
                         "Mysterious Pale Garden biome with subdued monochromatic flora. Uniquely atmospheric canvas for eerie, gothic builds.");

                const char *pb = biome2str(profile->mc_enum, pale_garden);
                snprintf(spot.primary_biome, sizeof(spot.primary_biome), "%s", pb ? pb : "pale_garden");
                is_candidate = 1;
            }

            if (is_candidate)
            {
                spot.x = x;
                spot.z = z;
                double dx = (double)x - (double)spawn_pos.x;
                double dz = (double)z - (double)spawn_pos.z;
                spot.distance_to_spawn = sqrt(dx * dx + dz * dz);
                snprintf(spot.teleport_command, sizeof(spot.teleport_command),
                         "/tp %d %d %d", spot.x, spot.y, spot.z);

                if (candidate_count < MAX_CANDIDATE_LANDMARKS)
                {
                    candidates[candidate_count++] = spot;
                }
            }
        }
    }

    out_landmarks->total_found = candidate_count;

    /* Sort candidates by combined score (favoring scenic/building quality and reasonable spawn distance) */
    for (int i = 0; i < candidate_count; i++)
    {
        for (int j = i + 1; j < candidate_count; j++)
        {
            double score_i = (double)(candidates[i].scenic_score + candidates[i].building_score) -
                             (candidates[i].distance_to_spawn * 0.004);
            double score_j = (double)(candidates[j].scenic_score + candidates[j].building_score) -
                             (candidates[j].distance_to_spawn * 0.004);

            if (score_j > score_i)
            {
                SeedLensLandmark tmp = candidates[i];
                candidates[i] = candidates[j];
                candidates[j] = tmp;
            }
        }
    }

    /* Deduplicate: Skip spots in the same category within 350m of an already selected spot,
       and cap each category to at most 6 spots to ensure balanced scenic & building variety */
    int final_count = 0;
    for (int i = 0; i < candidate_count && final_count < SEEDLENS_MAX_LANDMARKS; i++)
    {
        int duplicate = 0;
        int category_instances = 0;

        for (int j = 0; j < final_count; j++)
        {
            if (strcmp(candidates[i].category, out_landmarks->spots[j].category) == 0)
            {
                category_instances++;
                double d = distance_xy(candidates[i].x, candidates[i].z,
                                       out_landmarks->spots[j].x, out_landmarks->spots[j].z);
                if (d < 350.0)
                {
                    duplicate = 1;
                    break;
                }
            }
        }

        if (category_instances >= 6)
        {
            continue;
        }

        if (!duplicate)
        {
            out_landmarks->spots[final_count] = candidates[i];
            out_landmarks->spots[final_count].id = final_count + 1;
            final_count++;
        }
    }

    out_landmarks->spot_count = final_count;
    return final_count;
}
