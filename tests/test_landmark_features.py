#!/usr/bin/env python3
"""
SeedLens - Landmark Schema & Multi-Feature Structural Consistency Suite
Verifies landmark generation, schema constraints, secondary tag transfer,
Euclidean spawn distance calculation, and coordinate bounds across benchmark seeds.
Note: This is an algorithmic structural consistency test, not an in-game field verification.
"""

import subprocess
import json
import math
import sys

BENCHMARK_SEEDS = [
    ('123456789', '1.20.6'),
    ('2026', '1.20.6'),
    ('-1467692750553100038', '1.21.1'),
    ('202620262026202626', '1.21.4'),
]

KNOWN_CATEGORIES = {
    'cherry_caldera',
    'cherry_grove',
    'mountain_crater',
    'epic_clifftop',
    'prime_building_basin',
    'isolated_island',
    'pale_garden',
}

KNOWN_TAGS = {
    'cherry_blossom', 'mountain_ring', 'scenic_valley', 'highland', 'pink_canopy',
    'crater_ring', 'secluded_valley', 'natural_fortress', 'extreme_drop', 'ocean_vista',
    'floating_terrain', 'flat_terrain', 'waterfront', 'fertile', 'isolated',
    'ocean_sanctuary', 'island_survival', 'pale_garden', 'creaking', 'atmospheric'
}

def main():
    print("=== Running SeedLens Landmark Schema & Multi-Feature Suite ===")
    total_spots_tested = 0
    categories_seen = set()

    for seed, version in BENCHMARK_SEEDS:
        print(f"\n[Test Seed {seed} @ {version}]")
        cmd = ['./seedlens', seed, '--version', version]
        proc = subprocess.run(cmd, capture_output=True, text=True)
        assert proc.returncode == 0, f"Engine failed on seed {seed} ({proc.stderr})"

        data = json.loads(proc.stdout)
        landmarks = data.get('landmarks', {})
        spots = landmarks.get('spots', [])
        assert len(spots) > 0, f"No landmarks returned for seed {seed}"

        spawn = data.get('world_spawn', {})
        sx, sz = spawn.get('x'), spawn.get('z')
        assert sx is not None and sz is not None, "Missing world spawn coordinates"

        for spot in spots:
            total_spots_tested += 1
            cat = spot.get('category')
            categories_seen.add(cat)
            assert cat in KNOWN_CATEGORIES, f"Unknown category: {cat}"

            # 1. Coordinate and Height Verification
            x, y, z = spot.get('x'), spot.get('y'), spot.get('z')
            assert -5000 <= x <= 5000 and -5000 <= z <= 5000, f"Coordinates out of bounds: ({x}, {z})"
            assert 60 <= y <= 160, f"Unreasonable Y height estimate: {y}"

            # 2. Distance to Spawn Mathematical Consistency
            dx = x - sx
            dz = z - sz
            expected_dist = math.sqrt(dx * dx + dz * dz)
            reported_dist = spot.get('distance_to_spawn', 0.0)
            assert abs(expected_dist - reported_dist) < 0.05, (
                f"Spawn distance mismatch on spot #{spot.get('id')}: expected {expected_dist:.2f}, got {reported_dist:.2f}"
            )

            # 3. Teleport Command Format Verification
            expected_tp = f"/tp {x} {y} {z}"
            assert spot.get('teleport_command') == expected_tp, (
                f"Teleport command mismatch: expected '{expected_tp}', got '{spot.get('teleport_command')}'"
            )

            # 4. Multi-Feature Tags Verification
            tags = spot.get('tags', [])
            assert len(tags) >= 3, f"Spot #{spot.get('id')} has fewer than 3 tags: {tags}"
            assert len(set(tags)) == len(tags), f"Duplicate tags found in spot #{spot.get('id')}: {tags}"
            for t in tags:
                assert t in KNOWN_TAGS, f"Unrecognized feature tag '{t}' in spot #{spot.get('id')}"

            # 5. Surrounding Biomes Verification
            surrounding = spot.get('surrounding_biomes', [])
            assert isinstance(surrounding, list), "Surrounding biomes must be a list"
            assert len(surrounding) > 0, f"Spot #{spot.get('id')} has empty surrounding biomes"

            # 6. Scores Range
            sc = spot.get('scenic_score', 0)
            bc = spot.get('building_score', 0)
            assert 50 <= sc <= 100, f"Scenic score out of range: {sc}"
            assert 50 <= bc <= 100, f"Building score out of range: {bc}"

        print(f"  -> Verified {len(spots)} landmarks schema structure, coordinates, and tag integrity.")

    print(f"\nTotal landmark spots verified: {total_spots_tested}")
    print(f"Unique categories confirmed: {sorted(list(categories_seen))}")
    assert len(categories_seen) >= 6, "Expected at least 6 distinct categories represented"

    print("\nALL TARGETED LANDMARK TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    main()
