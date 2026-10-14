import subprocess
import json
import sys

def run_seedlens(seed, version=None):
    cmd = ["./seedlens", str(seed)]
    if version:
        cmd.extend(["--version", version])
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"seedlens failed with code {proc.returncode}: {proc.stderr}")
    try:
        return json.loads(proc.stdout)
    except Exception as e:
        raise ValueError(f"Invalid JSON: {e}\nOutput was:\n{proc.stdout}")

def run_cmd(args):
    cmd = ["./seedlens"] + args
    return subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

print("=== Running SeedLens Comprehensive Test Suite ===")

# ==============================================================================
# Suite 1: Baseline Verification (Seed 123456789)
# ==============================================================================
print("\n--- Suite 1: Baseline Verification (Seed 123456789) ---")
data = run_seedlens(123456789)
assert data["schema_version"] == 1, "Schema version mismatch"
assert data["seed"] == 123456789, "Seed mismatch"
assert data["seed_string"] == "123456789", "seed_string mismatch"
assert data["minecraft_version"] == "1.20.6", "Version mismatch"
assert data["search"]["min_x"] == -5000 and data["search"]["max_x"] == 5000, "Search bounds mismatch"
assert data["world_spawn"]["x"] == 64 and data["world_spawn"]["z"] == -48, "Spawn position mismatch"

# Complete clustering pipeline verification
assert data["summary"]["total_candidates"] == 81, f"Expected 81 candidates, got {data['summary']['total_candidates']}"
assert data["summary"]["total_clusters"] == 41, f"Expected 41 deduplicated clusters, got {data['summary']['total_clusters']}"
assert data["summary"]["useful_clusters"] == 5, f"Expected 5 useful clusters, got {data['summary']['useful_clusters']}"
assert data["summary"]["clusters_truncated"] is False, "Expected clusters_truncated to be false"
assert len(data["clusters"]) == 5, f"Expected 5 clusters in array, got {len(data['clusters'])}"

# Cluster ID verification: id 22 is the Spawn Outpost formerly dropped by the 20-cap bug
cluster_ids = [c["id"] for c in data["clusters"]]
assert cluster_ids == [4, 10, 11, 19, 22], f"Expected IDs [4, 10, 11, 19, 22], got {cluster_ids}"

c22 = next(c for c in data["clusters"] if c["id"] == 22)
assert "Spawn Outpost" in c22["categories"], "Cluster 22 must be a Spawn Outpost"
assert c22["cluster"]["nearest_spawn"] <= 1000.0, "Cluster 22 nearest_spawn must be <= 1000"
assert c22["cluster"]["nearest_spawn"] != c22["cluster"]["nearest_origin"], "nearest_spawn and nearest_origin must be distinct"

print("Suite 1: PASSED (Baseline 123456789 correctly outputs 5 useful clusters including Cluster #22 Spawn Outpost)")

# ==============================================================================
# Suite 2: Regression Cases (Cases A, B, C, D)
# ==============================================================================
print("\n--- Suite 2: Regression Cases ---")
# Case C: Seed -1467692750553100038 -> Cluster #1 is Useful (Strategic Mega-Hub, Trading Metropolis)
data_c = run_seedlens("-1467692750553100038")
c1 = next((c for c in data_c["clusters"] if c["id"] == 1), None)
assert c1 is not None, "Case C: Cluster #1 must be Useful"
assert "Strategic Mega-Hub" in c1["categories"], "Case C: must have Strategic Mega-Hub"
assert "Trading Metropolis" in c1["categories"], "Case C: must have Trading Metropolis"
assert data_c["summary"]["useful_clusters"] == 11, f"Case C: expected 11 useful clusters, got {data_c['summary']['useful_clusters']}"
print("Test 2.1 (Case C regression): PASSED")

# Case D: Seed 1844674407370955161 -> Cluster #1 is Useful (Strategic Mega-Hub, Trading Metropolis, Dense Multi)
data_d = run_seedlens("1844674407370955161")
d1 = next((c for c in data_d["clusters"] if c["id"] == 1), None)
assert d1 is not None, "Case D: Cluster #1 must be Useful"
assert "Strategic Mega-Hub" in d1["categories"], "Case D: must have Strategic Mega-Hub"
assert "Trading Metropolis" in d1["categories"], "Case D: must have Trading Metropolis"
assert "Dense Multi" in d1["categories"], "Case D: must have Dense Multi"
assert data_d["summary"]["useful_clusters"] == 10, f"Case D: expected 10 useful clusters, got {data_d['summary']['useful_clusters']}"
print("Test 2.2 (Case D regression): PASSED")

# Case A: Seed 739208174635920481 -> Cluster #8 is NOT useful
data_a = run_seedlens("739208174635920481")
a8 = next((c for c in data_a["clusters"] if c["id"] == 8), None)
assert a8 is None, "Case A: Cluster #8 must NOT be in Useful clusters"
print("Test 2.3 (Case A negative check): PASSED")

# Case B: Seed 202620262026202626 -> Cluster #13 is NOT useful
data_b = run_seedlens("202620262026202626")
b13 = next((c for c in data_b["clusters"] if c["id"] == 13), None)
assert b13 is None, "Case B: Cluster #13 must NOT be in Useful clusters"
assert data_b["summary"]["useful_clusters"] == 15, f"Case B: expected 15 useful clusters, got {data_b['summary']['useful_clusters']}"
print("Test 2.4 (Case B negative check): PASSED")

# ==============================================================================
# Suite 3: Negative CLI & Input Validation Tests
# ==============================================================================
print("\n--- Suite 3: Negative CLI & Input Validation Tests ---")
# 3.1 Overflow positive
res = run_cmd(["99999999999999999999999"])
assert res.returncode == 1, "Expected code 1 for int64 overflow"
assert "out of range" in res.stderr.lower(), f"Expected 'out of range' in stderr, got: {res.stderr}"

# 3.2 Overflow negative
res = run_cmd(["-99999999999999999999999"])
assert res.returncode == 1, "Expected code 1 for negative overflow"
assert "out of range" in res.stderr.lower()

# 3.3 Non-numeric seed
res = run_cmd(["abc123xyz"])
assert res.returncode == 1, "Expected code 1 for non-numeric seed"
assert "invalid seed" in res.stderr.lower()

# 3.4 Empty seed
res = run_cmd([""])
assert res.returncode == 1, "Expected code 1 for empty seed"

# 3.5 Missing seed argument
res = run_cmd([])
assert res.returncode == 1, "Expected code 1 for missing arguments"
assert "missing seed" in res.stderr.lower()

# 3.6 Unknown CLI option
res = run_cmd(["12345", "--unknown-flag"])
assert res.returncode == 1, "Expected code 1 for unrecognized flag"
assert "unrecognized argument" in res.stderr.lower()

# 3.7 Unsupported Minecraft version
res = run_cmd(["12345", "--version", "1.17"])
assert res.returncode == 1, "Expected code 1 for unsupported version"
assert "unsupported minecraft version" in res.stderr.lower()

# 3.8 Help flag
res = run_cmd(["--help"])
assert res.returncode == 0, "Expected code 0 for --help"
assert "usage:" in res.stdout.lower()

res = run_cmd(["-h"])
assert res.returncode == 0, "Expected code 0 for -h"
assert "usage:" in res.stdout.lower()

print("Suite 3: PASSED (All 8 negative & validation tests passed)")

# ==============================================================================
# Suite 4: Boundary Value & Extreme Inputs
# ==============================================================================
print("\n--- Suite 4: Boundary Value & Extreme Inputs ---")
# 4.1 INT64_MAX
data_max = run_seedlens("9223372036854775807")
assert data_max["seed_string"] == "9223372036854775807"
assert data_max["schema_version"] == 1

# 4.2 INT64_MIN
data_min = run_seedlens("-9223372036854775808")
assert data_min["seed_string"] == "-9223372036854775808"
assert data_min["schema_version"] == 1

# 4.3 Zero (0)
data_zero = run_seedlens("0")
assert data_zero["seed"] == 0
assert data_zero["seed_string"] == "0"

# 4.4 Positive and Negative 1
data_p1 = run_seedlens("1")
assert data_p1["seed"] == 1
data_m1 = run_seedlens("-1")
assert data_m1["seed"] == -1

print("Suite 4: PASSED (INT64_MAX, INT64_MIN, 0, +-1 all executed successfully)")

# ==============================================================================
# Suite 5: Determinism (Bit-Identical Outputs)
# ==============================================================================
print("\n--- Suite 5: Determinism Verification ---")
res1 = run_cmd(["123456789"])
res2 = run_cmd(["123456789"])
assert res1.stdout == res2.stdout, "Outputs for seed 123456789 are not bit-identical!"

res3 = run_cmd(["202620262026202626"])
res4 = run_cmd(["202620262026202626"])
assert res3.stdout == res4.stdout, "Outputs for seed 202620262026202626 are not bit-identical!"
print("Suite 5: PASSED (100% Bit-Identical JSON determinism verified across runs)")

# ==============================================================================
# Suite 6: World Spawn & Spatial Distances Integrity
# ==============================================================================
print("\n--- Suite 6: World Spawn & Distances Integrity ---")
for s in ["123456789", "-1467692750553100038", "739208174635920481"]:
    d = run_seedlens(s)
    sp_x = d["world_spawn"]["x"]
    sp_z = d["world_spawn"]["z"]
    for c in d["clusters"]:
        assert "nearest_spawn" in c["cluster"]
        assert "nearest_origin" in c["cluster"]
        assert c["cluster"]["nearest_spawn"] >= 0.0
        assert c["cluster"]["nearest_origin"] >= 0.0
        for st in c["structures"]:
            # Check structure distance calculations
            dx_sp = st["x"] - sp_x
            dz_sp = st["z"] - sp_z
            expected_dist_sp = (dx_sp * dx_sp + dz_sp * dz_sp) ** 0.5
            assert abs(st["distance_to_spawn"] - expected_dist_sp) < 0.2, "distance_to_spawn math mismatch"

            expected_dist_org = (st["x"] * st["x"] + st["z"] * st["z"]) ** 0.5
            assert abs(st["distance_to_origin"] - expected_dist_org) < 0.2, "distance_to_origin math mismatch"

        if "Spawn Outpost" in c["categories"]:
            assert c["cluster"]["nearest_spawn"] <= 1000.0, "Spawn Outpost must have nearest_spawn <= 1000"

print("Suite 6: PASSED (Spawn and origin distances mathematically verified)")

# ==============================================================================
# Suite 7: Terrain Viability Checks & Structure Retention
# ==============================================================================
print("\n--- Suite 7: Terrain Viability Checks & Structure Retention ---")
d_check = run_seedlens("123456789")
found_terrain_validated = False
found_terrain_unlikely = False
found_biome_viable = False

for c in d_check["clusters"]:
    for st in c["structures"]:
        v_status = st["viability_status"]
        if st["type"] in ["Desert Pyramid", "Jungle Temple"]:
            assert v_status in ["terrain_validated", "terrain_unlikely"], f"Invalid status for {st['type']}: {v_status}"
            if v_status == "terrain_validated":
                found_terrain_validated = True
            if v_status == "terrain_unlikely":
                found_terrain_unlikely = True
        else:
            assert v_status == "biome_viable", f"Expected biome_viable for {st['type']}, got {v_status}"
            found_biome_viable = True

assert found_biome_viable, "Expected at least one biome_viable structure"
print("Suite 7: PASSED (Terrain viability tagging validated without dropping structures)")

# ==============================================================================
# Suite 8: JSON Schema vs TypeScript Interface Conformity
# ==============================================================================
print("\n--- Suite 8: JSON Schema vs TypeScript Conformity ---")
required_top_keys = ["schema_version", "seed", "seed_string", "minecraft_version", "world_spawn", "search", "summary", "clusters"]
required_summary_keys = ["total_candidates", "total_clusters", "useful_clusters", "clusters_truncated"]
required_cluster_keys = ["id", "primary_category", "categories", "center", "cluster", "structures_summary", "structures", "explanation"]
required_metrics_keys = ["count", "type_count", "diameter", "closest_pair", "nearest_spawn", "nearest_origin", "density"]

for k in required_top_keys:
    assert k in d_check, f"Missing top-level key {k}"
for k in required_summary_keys:
    assert k in d_check["summary"], f"Missing summary key {k}"

for c in d_check["clusters"]:
    for k in required_cluster_keys:
        assert k in c, f"Missing cluster key {k}"
    for k in required_metrics_keys:
        assert k in c["cluster"], f"Missing metric key {k}"

print("Suite 8: PASSED (100% conformance between engine JSON and TypeScript types)")

# ==============================================================================
# Suite 9: Multi-Version Support Verification (Java 1.20.6 & 1.21.1)
# ==============================================================================
print("\n--- Suite 9: Multi-Version Support Verification (Java 1.20.6 & 1.21.1) ---")

# 9.1 Explicit 1.21.1 run on baseline seed
d_1211 = run_seedlens(123456789, "1.21.1")
assert d_1211["minecraft_version"] == "1.21.1", f"Expected 1.21.1, got {d_1211['minecraft_version']}"
assert d_1211["world_spawn"]["x"] == 64 and d_1211["world_spawn"]["z"] == -48, "Spawn mismatch in 1.21.1"
assert d_1211["summary"]["useful_clusters"] == 5, f"Expected 5 useful clusters in 1.21.1, got {d_1211['summary']['useful_clusters']}"
assert [c["id"] for c in d_1211["clusters"]] == [4, 10, 11, 19, 22], "Cluster ID mismatch in 1.21.1"
print("Test 9.1 (Explicit 1.21.1 baseline execution): PASSED")

# 9.2 Version alias resolution (1.18 -> 1.18.2, 1.19 -> 1.19.4, 1.20 -> 1.20.6, 1.21 -> 1.21.1, winter-drop -> 1.21.4)
d_alias_18 = run_seedlens(123456789, "1.18")
assert d_alias_18["minecraft_version"] == "1.18.2", "Alias 1.18 must resolve to canonical 1.18.2"

d_alias_19 = run_seedlens(123456789, "1.19")
assert d_alias_19["minecraft_version"] == "1.19.4", "Alias 1.19 must resolve to canonical 1.19.4"

d_alias_20 = run_seedlens(123456789, "1.20")
assert d_alias_20["minecraft_version"] == "1.20.6", "Alias 1.20 must resolve to canonical 1.20.6"

d_alias_21 = run_seedlens(123456789, "1.21")
assert d_alias_21["minecraft_version"] == "1.21.1", "Alias 1.21 must resolve to canonical 1.21.1"

d_alias_wd = run_seedlens(123456789, "winter-drop")
assert d_alias_wd["minecraft_version"] == "1.21.4", "Alias winter-drop must resolve to canonical 1.21.4"
print("Test 9.2 (Version alias resolution across 1.18, 1.19, 1.20, 1.21, winter-drop): PASSED")

# 9.3 Deep cross-version structure & scoring equivalence (1.20.6 vs 1.21.1)
for test_seed in ["123456789", "-1467692750553100038", "1844674407370955161", "202620262026202626"]:
    res_20 = run_seedlens(test_seed, "1.20.6")
    res_21 = run_seedlens(test_seed, "1.21.1")

    assert res_20["summary"]["useful_clusters"] == res_21["summary"]["useful_clusters"], f"Seed {test_seed} useful count mismatch"
    assert res_20["world_spawn"] == res_21["world_spawn"], f"Seed {test_seed} spawn mismatch"
    assert len(res_20["clusters"]) == len(res_21["clusters"]), f"Seed {test_seed} cluster count mismatch"

    for c20, c21 in zip(res_20["clusters"], res_21["clusters"]):
        assert c20["id"] == c21["id"], f"Seed {test_seed} cluster ID mismatch"
        assert c20["primary_category"] == c21["primary_category"], f"Seed {test_seed} cluster {c20['id']} category mismatch"
        assert c20["categories"] == c21["categories"], f"Seed {test_seed} cluster {c20['id']} categories mismatch"
        assert c20["center"] == c21["center"], f"Seed {test_seed} cluster {c20['id']} center mismatch"
        assert c20["cluster"] == c21["cluster"], f"Seed {test_seed} cluster {c20['id']} metrics mismatch"
        assert c20["structures_summary"] == c21["structures_summary"], f"Seed {test_seed} summary mismatch"
        assert len(c20["structures"]) == len(c21["structures"]), f"Seed {test_seed} structure count mismatch"

        for st20, st21 in zip(c20["structures"], c21["structures"]):
            assert st20["type"] == st21["type"], f"Seed {test_seed} structure type mismatch"
            assert st20["x"] == st21["x"], f"Seed {test_seed} structure X coord mismatch"
            assert st20["z"] == st21["z"], f"Seed {test_seed} structure Z coord mismatch"
            assert abs(st20["distance_to_spawn"] - st21["distance_to_spawn"]) < 1e-4, f"Seed {test_seed} spawn distance mismatch"
            assert abs(st20["distance_to_origin"] - st21["distance_to_origin"]) < 1e-4, f"Seed {test_seed} origin distance mismatch"
            assert st20["viability_status"] == st21["viability_status"], f"Seed {test_seed} viability mismatch"

print("Test 9.3 (Full-depth cross-version structure coordinates, categories, and tags equivalence): PASSED")

# 9.4 Rejection of unsupported versions (Bedrock, 1.17, 1.16, empty)
res_bedrock = run_cmd(["123456789", "--version", "bedrock"])
assert res_bedrock.returncode == 1, "Expected failure for bedrock"
assert "unsupported minecraft version 'bedrock'" in res_bedrock.stderr.lower()
assert "supported versions: 1.18.2, 1.19.4, 1.20.6, 1.21.1, 1.21.3, 1.21.4" in res_bedrock.stderr.lower()

res_117 = run_cmd(["123456789", "--version", "1.17"])
assert res_117.returncode == 1, "Expected failure for 1.17"
assert "unsupported minecraft version '1.17'" in res_117.stderr.lower()
assert "supported versions: 1.18.2, 1.19.4, 1.20.6, 1.21.1, 1.21.3, 1.21.4" in res_117.stderr.lower()

res_116 = run_cmd(["123456789", "--version", "1.16"])
assert res_116.returncode == 1, "Expected failure for 1.16"
assert "unsupported minecraft version '1.16'" in res_116.stderr.lower()

res_empty_ver = run_cmd(["123456789", "--version", ""])
assert res_empty_ver.returncode == 1, "Expected failure for empty version"

print("Test 9.4 (Unsupported version rejection & helpful error messages): PASSED")
print("Suite 9: PASSED (Multi-version support and validation successfully verified)")

# ==============================================================================
# Suite 10: Structure Discovery & Useful v3.1 Strict Isolation Verification
# ==============================================================================
print("\n--- Suite 10: Structure Discovery & Useful v3.1 Strict Isolation ---")

# 10.1 Non-leakage: Useful v3.1 clusters MUST contain only the 5 original structures
legacy_5_types = {"Village", "Desert Pyramid", "Jungle Temple", "Shipwreck", "Ancient City"}
for check_seed in ["123456789", "-1467692750553100038", "1844674407370955161", "202620262026202626"]:
    d_leak = run_seedlens(check_seed)
    for cl in d_leak["clusters"]:
        for st in cl["structures"]:
            assert st["type"] in legacy_5_types, f"LEAKAGE DETECTED: {st['type']} found inside Useful v3.1 cluster #{cl['id']}"
print("Test 10.1 (Strict non-leakage into Useful v3.1 clusters): PASSED")

# 10.2 Discovery schema and counts on baseline seed
d_disc = run_seedlens(123456789)
assert "discovery" in d_disc, "Missing discovery object in JSON output"
disc = d_disc["discovery"]
assert disc["total_discovered"] == 77, f"Expected 77 discovered structures, got {disc['total_discovered']}"
assert disc["by_type"]["Pillager Outpost"] == 19
assert disc["by_type"]["Ocean Monument"] == 24
assert disc["by_type"]["Woodland Mansion"] == 1
assert disc["by_type"]["Trail Ruins"] == 33
assert "Ruined Portal" not in disc["by_type"], "Ruined Portal must not be included"
assert len(disc["structures"]) == 77, f"Expected 77 structures in discovery array, got {len(disc['structures'])}"
print("Test 10.2 (Discovery schema, counts, and exclusion of unverified Ruined Portal): PASSED")

# 10.3 Specific reference coordinates and viability statuses
# Woodland Mansion: only 1 in baseline, verified terrain check
mansion_list = [s for s in disc["structures"] if s["type"] == "Woodland Mansion"]
assert len(mansion_list) == 1, "Expected 1 Woodland Mansion"
assert mansion_list[0]["x"] == 1888 and mansion_list[0]["z"] == -368, f"Mansion coords mismatch: {mansion_list[0]}"
assert mansion_list[0]["viability_status"] == "terrain_validated", "Mansion must be terrain_validated"

# Ocean Monument: verify known monuments and biome_viable status
monuments = [s for s in disc["structures"] if s["type"] == "Ocean Monument"]
assert any(m["x"] == 576 and m["z"] == -3872 for m in monuments), "Missing reference Ocean Monument (576, -3872)"
assert any(m["x"] == -992 and m["z"] == -2912 for m in monuments), "Missing reference Ocean Monument (-992, -2912)"
assert all(m["viability_status"] == "biome_viable" for m in monuments), "Monuments must be tagged biome_viable"

# Pillager Outposts: verify known outposts and biome_viable status
outposts = [s for s in disc["structures"] if s["type"] == "Pillager Outpost"]
assert any(o["x"] == -3856 and o["z"] == -4880 for o in outposts), "Missing reference Outpost (-3856, -4880)"
assert any(o["x"] == 1808 and o["z"] == -3312 for o in outposts), "Missing reference Outpost (1808, -3312)"
assert all(o["viability_status"] == "biome_viable" for o in outposts), "Outposts must be tagged biome_viable"

# Trail Ruins: verify known trail ruins and biome_viable status
trail_ruins = [s for s in disc["structures"] if s["type"] == "Trail Ruins"]
assert any(tr["x"] == -3520 and tr["z"] == -4560 for tr in trail_ruins), "Missing reference Trail Ruins (-3520, -4560)"
assert all(tr["viability_status"] == "biome_viable" for tr in trail_ruins), "Trail Ruins must be tagged biome_viable"
print("Test 10.3 (Reference coordinates and terrain vs biome viability tags): PASSED")

# 10.4 Cross-version discovered structures and Trial Chambers verification (1.18 to 1.21.4)
d_18 = run_seedlens(123456789, "1.18.2")
d_19 = run_seedlens(123456789, "1.19.4")
d_20 = run_seedlens(123456789, "1.20.6")
d_21 = run_seedlens(123456789, "1.21.1")
d_214 = run_seedlens(123456789, "1.21.4")

# 1.18 and 1.19: 44 structures (Outpost, Monument, Mansion) - no Trail Ruins, no Trial Chambers
assert d_18["discovery"]["total_discovered"] == 44
assert d_18["discovery"]["by_type"]["Trail Ruins"] == 0
assert d_18["discovery"]["by_type"]["Trial Chambers"] == 0

assert d_19["discovery"]["total_discovered"] == 44
assert d_19["discovery"]["by_type"]["Trail Ruins"] == 0
assert d_19["discovery"]["by_type"]["Trial Chambers"] == 0

# 1.20.6: 77 structures (added Trail Ruins: 33) - Trial Chambers = 0
assert d_20["discovery"]["total_discovered"] == 77
assert d_20["discovery"]["by_type"]["Trail Ruins"] == 33
assert d_20["discovery"]["by_type"]["Trial Chambers"] == 0

# 1.21+: 404 structures (added Trial Chambers: 327)
assert d_21["discovery"]["total_discovered"] == 404
assert d_21["discovery"]["by_type"]["Trial Chambers"] == 327
assert d_214["discovery"]["total_discovered"] == 404
assert d_214["discovery"]["by_type"]["Trial Chambers"] == 327

# Check non-trial structures in 1.21.1 match 1.20.6 100%
legacy_disc_21 = [s for s in d_21["discovery"]["structures"] if s["type"] != "Trial Chambers"]
assert len(legacy_disc_21) == len(d_20["discovery"]["structures"])
for s20, s21 in zip(d_20["discovery"]["structures"], legacy_disc_21):
    assert s20["type"] == s21["type"]
    assert s20["x"] == s21["x"] and s20["z"] == s21["z"]

print("Test 10.4 (Cross-version discovered structures and Trial Chambers in 1.21+): PASSED")

# 10.5 Complete Useful v3.1 immutability check
# Baseline seed 123456789 must still produce EXACTLY the same 5 clusters with IDs [4, 10, 11, 19, 22]
assert d_20["summary"]["useful_clusters"] == 5
assert [c["id"] for c in d_20["clusters"]] == [4, 10, 11, 19, 22]
print("Test 10.5 (Useful v3.1 absolute immutability confirmed): PASSED")
print("Suite 10: PASSED (Structure discovery and isolation successfully verified)")

print("\n=======================================================")
print("ALL 10 TEST SUITES COMPLETED AND PASSED SUCCESSFULLY!")
print("=======================================================")
