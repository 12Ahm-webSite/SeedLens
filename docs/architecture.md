# SeedLens Engine Architecture

## Overview
SeedLens is a deterministic analysis engine for Minecraft Java world seeds. It processes structure generation data provided by Cubiomes and performs multi-stage spatial clustering, category evaluation, and natural language explanation generation.

## Pipeline
```text
Seed + Minecraft Version (default: 1.20.6)
        ↓
Cubiomes Generator & Viability Finder
        ↓
Structure Records Collection (bounds: [-5000, 5000])
        ↓
Spatial Cluster Detection & Ranking (Radius 500m, Max Diam 800m)
        ↓
Useful v3.1 Category Evaluation (Spawn Outpost, Mega-Hub, Metropolis, Abyssal Hub, Dense Multi)
        ↓
Explanation Engine
        ↓
JSON Serialization / CLI Output (stdout)
```

## Useful v3.1 Categories
1. **Spawn Outpost**: Near world spawn (`spawn <= 1000m`, `count >= 3`, `diameter <= 720m`, `density >= 0.00001000`) with functional pairing (`Village+Shipwreck <= 450m` or `Village+Ancient City <= 450m` or `2+ Villages`).
2. **Strategic Mega-Hub**: High density & diversity (`count >= 5`, `types >= 3`, `closest_pair <= 180m`, `diameter <= 780m` with v3.1 compact diversity exception up to `800m` when `closest_pair <= 150m`).
3. **Trading Metropolis**: Multiple villages close enough for trade and expansion (`count >= 4`, `villages >= 2`, `spread <= 600m`, `diameter <= 760m`, `density >= 0.00001200`).
4. **Abyssal Hub (v3.1 Variant B)**: Surface-to-deep-dark connection (`count >= 4`, `diameter <= 780m`, `ancient_cities >= 1`, requiring `Village+Ancient City <= 450m` or `Shipwreck+Ancient City <= 250m` if no village).
5. **Dense Multi**: Very compact clustering (`closest_pair <= 100m`, `count >= 4`, `diameter <= 700m`, `density >= 0.00001400`).

## JSON Output Schema
The CLI prints pure JSON to `stdout` containing:
- `seed`: 64-bit integer
- `minecraft_version`: string (e.g. `"1.20.6"`)
- `search`: `{ "min_x", "max_x", "min_z", "max_z" }`
- `summary`: `{ "total_clusters", "useful_clusters" }`
- `clusters`: Array of useful clusters with:
  - `id`: 1-based cluster number
  - `primary_category`: string
  - `categories`: string array
  - `center`: `{ "x", "z" }`
  - `cluster`: metrics object (`count`, `type_count`, `diameter`, `closest_pair`, `nearest_spawn`, `density`)
  - `structures_summary`: type count inventory
  - `structures`: array of individual structures with Minecraft block coordinates (`type`, `x`, `z`, `distance_to_spawn`)
  - `explanation`: human-readable explanation string
