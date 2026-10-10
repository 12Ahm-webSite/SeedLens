# SeedLens

Deterministic Minecraft Java world seed analysis engine built on top of Cubiomes.

## Features
- **Structure Discovery & Viability**: Fast deterministic structure verification for Minecraft Java 1.20.6.
- **Cluster Detection**: Multi-pass spatial clustering and ranking up to radius 5000 blocks.
- **Useful v3.1 Analysis**: Rigorously calibrated category rules (Spawn Outpost, Strategic Mega-Hub, Trading Metropolis, Abyssal Hub, Dense Multi).
- **Explanation Engine**: Natural language explanation for every high-value cluster.
- **CLI & JSON API**: Pure JSON output to `stdout` designed for backend process consumers.

## Building
```bash
make
```

## Usage
```bash
./seedlens 123456789
```

With custom Minecraft version (currently supporting 1.20.6):
```bash
./seedlens 123456789 --version 1.20.6
```

## Running Tests
```bash
make test
```

## License & Acknowledgements
- SeedLens is licensed under the [MIT License](LICENSE).
- Powered by [cubiomes](https://github.com/Cubitect/cubiomes) by Cubitect (MIT License).
