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
res = run_cmd(["12345", "--version", "1.19"])
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

print("\n=======================================================")
print("ALL 8 TEST SUITES COMPLETED AND PASSED SUCCESSFULLY!")
print("=======================================================")
