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

print("=== Running SeedLens CLI & Engine Tests ===")

# 1. Test Seed 123456789
data = run_seedlens(123456789)
assert data["seed"] == 123456789, "Seed mismatch"
assert data["minecraft_version"] == "1.20.6", "Version mismatch"
assert data["search"]["min_x"] == -5000 and data["search"]["max_x"] == 5000, "Search bounds mismatch"
assert data["summary"]["total_clusters"] == 20, f"Expected 20 total clusters, got {data['summary']['total_clusters']}"
assert data["summary"]["useful_clusters"] == 4, f"Expected 4 useful clusters, got {data['summary']['useful_clusters']}"
assert len(data["clusters"]) == 4, f"Expected 4 clusters in array, got {len(data['clusters'])}"

for c in data["clusters"]:
    assert "id" in c
    assert "primary_category" in c
    assert "categories" in c and len(c["categories"]) >= 1
    assert "center" in c and "x" in c["center"] and "z" in c["center"]
    assert "cluster" in c
    assert "structures" in c and len(c["structures"]) >= 1
    assert "structures_summary" in c and len(c["structures_summary"]) >= 1
    assert "explanation" in c and len(c["explanation"]) > 10

print("Test 1 (Seed 123456789 baseline verification): PASSED")

# 2. Critical Regression Cases
# Case C: Seed -1467692750553100038 -> Cluster #1 is Useful (Strategic Mega-Hub, Trading Metropolis)
data_c = run_seedlens("-1467692750553100038")
c1 = next((c for c in data_c["clusters"] if c["id"] == 1), None)
assert c1 is not None, "Case C: Cluster #1 must be Useful"
assert "Strategic Mega-Hub" in c1["categories"], "Case C: must have Strategic Mega-Hub"
assert "Trading Metropolis" in c1["categories"], "Case C: must have Trading Metropolis"
print("Test 2 (Case C regression): PASSED")

# Case D: Seed 1844674407370955161 -> Cluster #1 is Useful (Strategic Mega-Hub, Trading Metropolis, Dense Multi)
data_d = run_seedlens("1844674407370955161")
d1 = next((c for c in data_d["clusters"] if c["id"] == 1), None)
assert d1 is not None, "Case D: Cluster #1 must be Useful"
assert "Strategic Mega-Hub" in d1["categories"], "Case D: must have Strategic Mega-Hub"
assert "Trading Metropolis" in d1["categories"], "Case D: must have Trading Metropolis"
assert "Dense Multi" in d1["categories"], "Case D: must have Dense Multi"
print("Test 3 (Case D regression): PASSED")

# Case A: Seed 739208174635920481 -> Cluster #8 is NOT useful
data_a = run_seedlens("739208174635920481")
a8 = next((c for c in data_a["clusters"] if c["id"] == 8), None)
assert a8 is None, "Case A: Cluster #8 must NOT be in Useful clusters"
print("Test 4 (Case A negative check): PASSED")

# Case B: Seed 202620262026202626 -> Cluster #13 is NOT useful
data_b = run_seedlens("202620262026202626")
b13 = next((c for c in data_b["clusters"] if c["id"] == 13), None)
assert b13 is None, "Case B: Cluster #13 must NOT be in Useful clusters"
print("Test 5 (Case B negative check): PASSED")

print("\nALL SEEDLENS CLI & REGRESSION TESTS PASSED SUCCESSFULLY!")
