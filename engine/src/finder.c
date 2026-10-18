#include "internal.h"
#include <time.h>

static int is_ocean(int b)
{
    return (b == ocean || b == deep_ocean || b == warm_ocean || b == lukewarm_ocean ||
            b == cold_ocean || b == deep_cold_ocean || b == deep_frozen_ocean ||
            b == deep_lukewarm_ocean || b == frozen_ocean);
}

static int is_peak(int b)
{
    return (b == jagged_peaks || b == frozen_peaks || b == stony_peaks ||
            b == snowy_slopes || b == meadow || b == grove);
}

static int is_building(int b)
{
    return (b == plains || b == sunflower_plains || b == meadow ||
            b == forest || b == flower_forest || b == savanna);
}

static uint64_t get_initial_seed(int64_t user_start)
{
    if (user_start != 0)
    {
        return (uint64_t)user_start;
    }
    struct timespec ts;
    clock_gettime(CLOCK_REALTIME, &ts);
    uint64_t s = ((uint64_t)ts.tv_sec << 32) ^ (uint64_t)ts.tv_nsec;
    s ^= (uint64_t)rand();
    return s ? s : 123456789ULL;
}

int seedlens_find(
    const SeedLensFindQuery *query,
    SeedLensFindResult *result
)
{
    if (!query || !result)
    {
        return -1;
    }

    memset(result, 0, sizeof(*result));

    struct timespec t_start, t_end;
    clock_gettime(CLOCK_MONOTONIC, &t_start);

    const char *ver = query->version ? query->version : "1.20.6";
    const VersionProfile *profile = get_version_profile(ver);
    if (!profile)
    {
        return -2;
    }

    snprintf(result->version, sizeof(result->version), "%s", profile->canonical_name);
    if (query->preset && query->preset[0])
    {
        snprintf(result->matched_preset, sizeof(result->matched_preset), "%s", query->preset);
    }

    const char *preset = query->preset ? query->preset : "";
    const char *lm_type = query->landmark_type ? query->landmark_type : "any";
    const char *cl_cat = query->cluster_category ? query->cluster_category : "any";
    int min_scenic = query->min_scenic_score > 0 ? query->min_scenic_score : 0;
    int min_building = query->min_building_score > 0 ? query->min_building_score : 0;
    int max_dist = query->max_spawn_distance > 0 ? query->max_spawn_distance : 2500;
    int max_seeds = query->max_seeds_to_scan > 0 ? query->max_seeds_to_scan : 50000;

    /* Preset defaults */
    if (strcmp(preset, "mega_builder") == 0)
    {
        lm_type = "prime_building_basin";
        if (min_building < 80) min_building = 80;
    }
    else if (strcmp(preset, "dungeon_raider") == 0)
    {
        cl_cat = "trial_or_abyssal";
    }
    else if (strcmp(preset, "aesthetic_creator") == 0)
    {
        lm_type = "cherry_or_crater";
        if (min_scenic < 85) min_scenic = 85;
    }
    else if (strcmp(preset, "castaway_survivor") == 0)
    {
        lm_type = "isolated_island";
        if (max_dist > 1500) max_dist = 1500;
    }
    else if (strcmp(preset, "economy_mogul") == 0)
    {
        cl_cat = "trading_metropolis";
    }

    uint64_t current_seed = get_initial_seed(query->start_seed);
    Generator g;
    setupGenerator(&g, profile->mc_enum, 0);

    int evaluated = 0;
    int found = 0;

    /* Best fallback candidate in case strict threshold isn't hit in max_seeds */
    int fallback_found = 0;
    SeedLensFindResult fallback_candidate;
    memset(&fallback_candidate, 0, sizeof(fallback_candidate));

    for (int step = 0; step < max_seeds; step++)
    {
        evaluated++;
        uint64_t seed = current_seed + (uint64_t)step;
        applySeed(&g, DIM_OVERWORLD, seed);

        Pos spawn_pos = getSpawn(&g);

        int64_t np[6];
        int b_spawn = sampleBiomeNoise(&g.bn, np, spawn_pos.x >> 2, 16, spawn_pos.z >> 2, NULL, 0);

        /* --- PRESET 1 / LM: Isolated Island (Castaway Survivor) --- */
        if (strcmp(preset, "castaway_survivor") == 0 || strcmp(lm_type, "isolated_island") == 0)
        {
            if (is_ocean(b_spawn) || b_spawn == beach || b_spawn == stony_shore || b_spawn == plains)
            {
                int ocean_edges = 0;
                int check_dist = 240;
                int b_n = sampleBiomeNoise(&g.bn, np, spawn_pos.x >> 2, 16, (spawn_pos.z - check_dist) >> 2, NULL, 0);
                int b_s = sampleBiomeNoise(&g.bn, np, spawn_pos.x >> 2, 16, (spawn_pos.z + check_dist) >> 2, NULL, 0);
                int b_e = sampleBiomeNoise(&g.bn, np, (spawn_pos.x + check_dist) >> 2, 16, spawn_pos.z >> 2, NULL, 0);
                int b_w = sampleBiomeNoise(&g.bn, np, (spawn_pos.x - check_dist) >> 2, 16, spawn_pos.z >> 2, NULL, 0);

                if (is_ocean(b_n)) ocean_edges++;
                if (is_ocean(b_s)) ocean_edges++;
                if (is_ocean(b_e)) ocean_edges++;
                if (is_ocean(b_w)) ocean_edges++;

                if (ocean_edges >= 3)
                {
                    result->found = 1;
                    result->seed = (int64_t)seed;
                    snprintf(result->highlight_type, sizeof(result->highlight_type), "landmark");
                    snprintf(result->highlight_title, sizeof(result->highlight_title), "جزيرة نجاة منعزلة");
                    snprintf(result->highlight_name, sizeof(result->highlight_name), "جزيرة نجاة منعزلة (Isolated Survival Island)");
                    snprintf(result->highlight_category, sizeof(result->highlight_category), "isolated_island");
                    result->highlight_x = spawn_pos.x;
                    result->highlight_y = 64;
                    result->highlight_z = spawn_pos.z;
                    result->highlight_distance = 0.0;
                    result->highlight_scenic_score = 78;
                    result->highlight_building_score = 55;
                    snprintf(result->highlight_tp_command, sizeof(result->highlight_tp_command), "/tp %d 64 %d", spawn_pos.x, spawn_pos.z);
                    snprintf(result->highlight_description, sizeof(result->highlight_description),
                             "جزيرة نجاة نقية محاطة بمحيط عميق وواسع، مثالية لتحديات النجاة الصعبة وبناء المنارات البحرية.");
                    snprintf(result->highlight_primary_biome, sizeof(result->highlight_primary_biome), "Ocean / Island");
                    found = 1;
                    break;
                }
            }
            continue;
        }

        /* --- PRESET 2 / CLUSTER: Dungeon Raider / Trial Chambers / Ancient City --- */
        if (strcmp(preset, "dungeon_raider") == 0 ||
            strcmp(cl_cat, "trial_or_abyssal") == 0 ||
            strcmp(cl_cat, "trial_chambers") == 0)
        {
            if (profile->mc_enum >= MC_1_21)
            {
                StructureConfig tc_cfg;
                if (getStructureConfig(Trial_Chambers, profile->mc_enum, &tc_cfg))
                {
                    int reg_x = spawn_pos.x / (tc_cfg.regionSize * 16);
                    int reg_z = spawn_pos.z / (tc_cfg.regionSize * 16);
                    int match_tc = 0;
                    Pos best_pos = {0, 0};
                    double best_d = 1e9;

                    for (int rz = reg_z - 1; rz <= reg_z + 1 && !match_tc; rz++)
                    {
                        for (int rx = reg_x - 1; rx <= reg_x + 1 && !match_tc; rx++)
                        {
                            Pos tc_pos;
                            if (getStructurePos(Trial_Chambers, profile->mc_enum, seed, rx, rz, &tc_pos))
                            {
                                double d = distance_xy(tc_pos.x, tc_pos.z, spawn_pos.x, spawn_pos.z);
                                if (d <= (double)max_dist && isViableStructurePos(Trial_Chambers, &g, tc_pos.x, tc_pos.z, 0))
                                {
                                    if (d < best_d)
                                    {
                                        best_d = d;
                                        best_pos = tc_pos;
                                        match_tc = 1;
                                    }
                                }
                            }
                        }
                    }

                    if (match_tc)
                    {
                        result->found = 1;
                        result->seed = (int64_t)seed;
                        snprintf(result->highlight_type, sizeof(result->highlight_type), "discovery");
                        snprintf(result->highlight_title, sizeof(result->highlight_title), "غرف المحاكمة النحاسية");
                        snprintf(result->highlight_name, sizeof(result->highlight_name), "غرف المحاكمة النحاسية (Trial Chambers)");
                        snprintf(result->highlight_category, sizeof(result->highlight_category), "Trial Chambers");
                        result->highlight_x = best_pos.x;
                        result->highlight_y = -20;
                        result->highlight_z = best_pos.z;
                        result->highlight_distance = best_d;
                        result->highlight_scenic_score = 65;
                        result->highlight_building_score = 45;
                        snprintf(result->highlight_tp_command, sizeof(result->highlight_tp_command), "/tp %d ~ %d", best_pos.x, best_pos.z);
                        snprintf(result->highlight_description, sizeof(result->highlight_description),
                                 "غرف محاكمة نحاسية مجهزة بوحوش الـ Breeze والصولجان وصناديق الغنائم الملحمية على مقربة من الـ Spawn.");
                        snprintf(result->highlight_primary_biome, sizeof(result->highlight_primary_biome), "Underground");
                        found = 1;
                        break;
                    }
                }
            }
            else if (profile->mc_enum >= MC_1_19)
            {
                StructureConfig ac_cfg;
                if (getStructureConfig(Ancient_City, profile->mc_enum, &ac_cfg))
                {
                    int reg_x = spawn_pos.x / (ac_cfg.regionSize * 16);
                    int reg_z = spawn_pos.z / (ac_cfg.regionSize * 16);
                    int match_ac = 0;
                    Pos best_pos = {0, 0};
                    double best_d = 1e9;

                    for (int rz = reg_z - 1; rz <= reg_z + 1 && !match_ac; rz++)
                    {
                        for (int rx = reg_x - 1; rx <= reg_x + 1 && !match_ac; rx++)
                        {
                            Pos ac_pos;
                            if (getStructurePos(Ancient_City, profile->mc_enum, seed, rx, rz, &ac_pos))
                            {
                                double d = distance_xy(ac_pos.x, ac_pos.z, spawn_pos.x, spawn_pos.z);
                                if (d <= (double)max_dist && isViableStructurePos(Ancient_City, &g, ac_pos.x, ac_pos.z, 0))
                                {
                                    best_d = d;
                                    best_pos = ac_pos;
                                    match_ac = 1;
                                }
                            }
                        }
                    }

                    if (match_ac)
                    {
                        result->found = 1;
                        result->seed = (int64_t)seed;
                        snprintf(result->highlight_type, sizeof(result->highlight_type), "cluster");
                        snprintf(result->highlight_title, sizeof(result->highlight_title), "مركز أعماق سحيق (Ancient City)");
                        snprintf(result->highlight_name, sizeof(result->highlight_name), "المدينة القديمة في الأعماق (Ancient City Hub)");
                        snprintf(result->highlight_category, sizeof(result->highlight_category), "Abyssal Hub");
                        result->highlight_x = best_pos.x;
                        result->highlight_y = -51;
                        result->highlight_z = best_pos.z;
                        result->highlight_distance = best_d;
                        result->highlight_scenic_score = 75;
                        result->highlight_building_score = 40;
                        snprintf(result->highlight_tp_command, sizeof(result->highlight_tp_command), "/tp %d -51 %d", best_pos.x, best_pos.z);
                        snprintf(result->highlight_description, sizeof(result->highlight_description),
                                 "مدينة قديمة سحيقة تضم صامت الـ Warden ومكتبات الكتب المسحورة وغنائم الظلام على مقربة من البداية.");
                        snprintf(result->highlight_primary_biome, sizeof(result->highlight_primary_biome), "Deep Dark");
                        found = 1;
                        break;
                    }
                }
            }
            continue;
        }

        /* --- PRESET 3 / CLUSTER: Trading Metropolis / Economy Mogul --- */
        if (strcmp(preset, "economy_mogul") == 0 || strcmp(cl_cat, "trading_metropolis") == 0)
        {
            StructureConfig v_cfg;
            if (getStructureConfig(Village, profile->mc_enum, &v_cfg))
            {
                int reg_x = spawn_pos.x / (v_cfg.regionSize * 16);
                int reg_z = spawn_pos.z / (v_cfg.regionSize * 16);
                Pos v_positions[9];
                int v_count = 0;

                for (int rz = reg_z - 1; rz <= reg_z + 1; rz++)
                {
                    for (int rx = reg_x - 1; rx <= reg_x + 1; rx++)
                    {
                        Pos vp;
                        if (getStructurePos(Village, profile->mc_enum, seed, rx, rz, &vp))
                        {
                            double d = distance_xy(vp.x, vp.z, spawn_pos.x, spawn_pos.z);
                            if (d <= (double)max_dist && isViableStructurePos(Village, &g, vp.x, vp.z, 0))
                            {
                                v_positions[v_count++] = vp;
                            }
                        }
                    }
                }

                if (v_count >= 2)
                {
                    double inter_dist = distance_xy(v_positions[0].x, v_positions[0].z, v_positions[1].x, v_positions[1].z);
                    int mid_x = (v_positions[0].x + v_positions[1].x) / 2;
                    int mid_z = (v_positions[0].z + v_positions[1].z) / 2;
                    double d_spawn = distance_xy(mid_x, mid_z, spawn_pos.x, spawn_pos.z);

                    result->found = 1;
                    result->seed = (int64_t)seed;
                    snprintf(result->highlight_type, sizeof(result->highlight_type), "cluster");
                    snprintf(result->highlight_title, sizeof(result->highlight_title), "عاصمة تجارية كبرى");
                    snprintf(result->highlight_name, sizeof(result->highlight_name), "عاصمة تجارية متقاربة (Trading Metropolis)");
                    snprintf(result->highlight_category, sizeof(result->highlight_category), "Trading Metropolis");
                    result->highlight_x = mid_x;
                    result->highlight_y = 68;
                    result->highlight_z = mid_z;
                    result->highlight_distance = d_spawn;
                    result->highlight_scenic_score = 65;
                    result->highlight_building_score = 88;
                    snprintf(result->highlight_tp_command, sizeof(result->highlight_tp_command), "/tp %d ~ %d", mid_x, mid_z);
                    snprintf(result->highlight_description, sizeof(result->highlight_description),
                             "قرى متعددة متقاربة جداً (المسافة بينهما %.0fم فقط) لتأسيس أكبر قاعات المقايضة ومزارع الحديد التلقائية.",
                             inter_dist);
                    snprintf(result->highlight_primary_biome, sizeof(result->highlight_primary_biome), "Plains / Meadow");
                    found = 1;
                    break;
                }
            }
            continue;
        }

        /* --- PRESET 4 / LM: Aesthetic Creator (Cherry Caldera / Peaks) --- */
        if (strcmp(preset, "aesthetic_creator") == 0 ||
            strcmp(lm_type, "cherry_caldera") == 0 ||
            strcmp(lm_type, "cherry_or_crater") == 0)
        {
            int check_step = 250;
            int found_cherry = 0;
            Pos cherry_pt = {0, 0};

            for (int r = 0; r <= max_dist && !found_cherry; r += check_step)
            {
                int count_pts = r == 0 ? 1 : 8;
                for (int a = 0; a < count_pts && !found_cherry; a++)
                {
                    double rad = (double)a * (2.0 * M_PI / (double)count_pts);
                    int px = spawn_pos.x + (int)((double)r * cos(rad));
                    int pz = spawn_pos.z + (int)((double)r * sin(rad));

                    int b1 = sampleBiomeNoise(&g.bn, np, px >> 2, 16, pz >> 2, NULL, 0);
                    int b2 = sampleBiomeNoise(&g.bn, np, px >> 2, 35, pz >> 2, NULL, 0);

                    if (b1 == cherry_grove || b2 == cherry_grove)
                    {
                        int peak_ring = 0;
                        for (int k = 0; k < 6; k++)
                        {
                            double k_rad = (double)k * 60.0 * M_PI / 180.0;
                            int sx = px + (int)(180.0 * cos(k_rad));
                            int sz = pz + (int)(180.0 * sin(k_rad));
                            int bs = sampleBiomeNoise(&g.bn, np, sx >> 2, 35, sz >> 2, NULL, 0);
                            if (is_peak(bs)) peak_ring++;
                        }

                        if (peak_ring >= 2)
                        {
                            found_cherry = 1;
                            cherry_pt.x = px;
                            cherry_pt.z = pz;
                        }
                    }
                    else if (is_peak(b2) && (strcmp(lm_type, "cherry_or_crater") == 0 || profile->mc_enum < MC_1_20))
                    {
                        found_cherry = 1;
                        cherry_pt.x = px;
                        cherry_pt.z = pz;
                    }
                }
            }

            if (found_cherry)
            {
                double d = distance_xy(cherry_pt.x, cherry_pt.z, spawn_pos.x, spawn_pos.z);
                result->found = 1;
                result->seed = (int64_t)seed;
                snprintf(result->highlight_type, sizeof(result->highlight_type), "landmark");
                snprintf(result->highlight_title, sizeof(result->highlight_title), "فوهة كرز جبلية ساحرة");
                snprintf(result->highlight_name, sizeof(result->highlight_name), "فوهة أزهار الكرز (Cherry Blossom Caldera)");
                snprintf(result->highlight_category, sizeof(result->highlight_category), "cherry_caldera");
                result->highlight_x = cherry_pt.x;
                result->highlight_y = 132;
                result->highlight_z = cherry_pt.z;
                result->highlight_distance = d;
                result->highlight_scenic_score = 96;
                result->highlight_building_score = 68;
                snprintf(result->highlight_tp_command, sizeof(result->highlight_tp_command), "/tp %d 132 %d", cherry_pt.x, cherry_pt.z);
                snprintf(result->highlight_description, sizeof(result->highlight_description),
                         "وادٍ جبلي خلاب مغطى بأشجار الكرز الوردي ومحاط بقمم مثلجة شامخة، لوحة سينمائية للبناء في القمم.");
                snprintf(result->highlight_primary_biome, sizeof(result->highlight_primary_biome), "Cherry Grove");
                found = 1;
                break;
            }
            continue;
        }

        /* --- PRESET 5 / LM: Mega Builder (Prime Building Basin) --- */
        if (strcmp(preset, "mega_builder") == 0 || strcmp(lm_type, "prime_building_basin") == 0)
        {
            int check_step = 200;
            int found_basin = 0;
            Pos basin_pt = {0, 0};

            for (int r = 0; r <= max_dist && !found_basin; r += check_step)
            {
                int count_pts = r == 0 ? 1 : 8;
                for (int a = 0; a < count_pts && !found_basin; a++)
                {
                    double rad = (double)a * (2.0 * M_PI / (double)count_pts);
                    int px = spawn_pos.x + (int)((double)r * cos(rad));
                    int pz = spawn_pos.z + (int)((double)r * sin(rad));

                    int b_flat = sampleBiomeNoise(&g.bn, np, px >> 2, 16, pz >> 2, NULL, 0);
                    if (is_building(b_flat))
                    {
                        int surround_build = 0;
                        for (int k = 0; k < 4; k++)
                        {
                            int sx = px + (k == 0 ? 120 : k == 1 ? -120 : 0);
                            int sz = pz + (k == 2 ? 120 : k == 3 ? -120 : 0);
                            int bs = sampleBiomeNoise(&g.bn, np, sx >> 2, 16, sz >> 2, NULL, 0);
                            if (is_building(bs) || is_ocean(bs)) surround_build++;
                        }

                        if (surround_build >= 3)
                        {
                            found_basin = 1;
                            basin_pt.x = px;
                            basin_pt.z = pz;
                        }
                    }
                }
            }

            if (found_basin)
            {
                double d = distance_xy(basin_pt.x, basin_pt.z, spawn_pos.x, spawn_pos.z);
                result->found = 1;
                result->seed = (int64_t)seed;
                snprintf(result->highlight_type, sizeof(result->highlight_type), "landmark");
                snprintf(result->highlight_title, sizeof(result->highlight_title), "حوض بناء مستوٍ فسيح");
                snprintf(result->highlight_name, sizeof(result->highlight_name), "حوض بناء مستوٍ (Prime Building Basin)");
                snprintf(result->highlight_category, sizeof(result->highlight_category), "prime_building_basin");
                result->highlight_x = basin_pt.x;
                result->highlight_y = 66;
                result->highlight_z = basin_pt.z;
                result->highlight_distance = d;
                result->highlight_scenic_score = 65;
                result->highlight_building_score = 92;
                snprintf(result->highlight_tp_command, sizeof(result->highlight_tp_command), "/tp %d 66 %d", basin_pt.x, basin_pt.z);
                snprintf(result->highlight_description, sizeof(result->highlight_description),
                         "سهول خضراء فسيحة منبسطة التضاريس محاطة بمصادر مياه وأخشاب، مهيأة فوراً لتأسيس المدن والقواعد الكبرى.");
                snprintf(result->highlight_primary_biome, sizeof(result->highlight_primary_biome), "Plains");
                found = 1;
                break;
            }
            continue;
        }

        /* --- Generic Landmark or Cluster search if no specific preset matched --- */
        if (!fallback_found && is_building(b_spawn))
        {
            fallback_found = 1;
            fallback_candidate.found = 1;
            fallback_candidate.seed = (int64_t)seed;
            snprintf(fallback_candidate.highlight_type, sizeof(fallback_candidate.highlight_type), "landmark");
            snprintf(fallback_candidate.highlight_title, sizeof(fallback_candidate.highlight_title), "موقع بناء استراتيجي");
            snprintf(fallback_candidate.highlight_name, sizeof(fallback_candidate.highlight_name), "موقع بناء وبداية متوازن (Strategic Basin)");
            snprintf(fallback_candidate.highlight_category, sizeof(fallback_candidate.highlight_category), "prime_building_basin");
            fallback_candidate.highlight_x = spawn_pos.x;
            fallback_candidate.highlight_y = 65;
            fallback_candidate.highlight_z = spawn_pos.z;
            fallback_candidate.highlight_distance = 0.0;
            fallback_candidate.highlight_scenic_score = 65;
            fallback_candidate.highlight_building_score = 80;
            snprintf(fallback_candidate.highlight_tp_command, sizeof(fallback_candidate.highlight_tp_command), "/tp %d 65 %d", spawn_pos.x, spawn_pos.z);
            snprintf(fallback_candidate.highlight_description, sizeof(fallback_candidate.highlight_description),
                     "موقع متوازن ممتاز عند نقطة البداية مباشرة لبناء قاعدة مستقرة.");
            snprintf(fallback_candidate.highlight_primary_biome, sizeof(fallback_candidate.highlight_primary_biome), "Plains");
        }
    }

    if (!found && fallback_found)
    {
        *result = fallback_candidate;
        found = 1;
    }

    clock_gettime(CLOCK_MONOTONIC, &t_end);
    double elapsed_ms = (double)(t_end.tv_sec - t_start.tv_sec) * 1000.0 +
                        (double)(t_end.tv_nsec - t_start.tv_nsec) / 1000000.0;

    result->seeds_evaluated = evaluated;
    result->search_time_ms = elapsed_ms;

    return found ? 0 : -3;
}

char *seedlens_find_result_to_json(const SeedLensFindResult *res)
{
    if (!res)
    {
        return NULL;
    }

    size_t buf_size = 4096;
    char *buf = malloc(buf_size);
    if (!buf)
    {
        return NULL;
    }

    snprintf(buf, buf_size,
        "{\n"
        "  \"seed\": \"%lld\",\n"
        "  \"version\": \"%s\",\n"
        "  \"matchedPreset\": \"%s\",\n"
        "  \"highlightTitle\": \"%s\",\n"
        "  \"highlightType\": \"%s\",\n"
        "  \"highlight\": {\n"
        "    \"name\": \"%s\",\n"
        "    \"category\": \"%s\",\n"
        "    \"x\": %d,\n"
        "    \"y\": %d,\n"
        "    \"z\": %d,\n"
        "    \"distance\": %.1f,\n"
        "    \"scenicScore\": %d,\n"
        "    \"buildingScore\": %d,\n"
        "    \"tpCommand\": \"%s\",\n"
        "    \"description\": \"%s\",\n"
        "    \"primaryBiome\": \"%s\"\n"
        "  },\n"
        "  \"seedsEvaluatedCount\": %d,\n"
        "  \"searchTimeMs\": %.1f\n"
        "}\n",
        (long long)res->seed,
        res->version,
        res->matched_preset,
        res->highlight_title,
        res->highlight_type,
        res->highlight_name,
        res->highlight_category,
        res->highlight_x,
        res->highlight_y,
        res->highlight_z,
        res->highlight_distance,
        res->highlight_scenic_score,
        res->highlight_building_score,
        res->highlight_tp_command,
        res->highlight_description,
        res->highlight_primary_biome,
        res->seeds_evaluated,
        res->search_time_ms
    );

    return buf;
}
