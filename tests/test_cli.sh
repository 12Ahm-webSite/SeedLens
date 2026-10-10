#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

if [ ! -x "./seedlens" ]; then
    echo "Executable ./seedlens not found. Building..."
    make
fi

python3 tests/test_regression.py
