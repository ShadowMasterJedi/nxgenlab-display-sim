#!/usr/bin/env bash
# Local preview server for NxGenLab Display Simulator
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-8766}"
echo "NxGenLab Display Simulator → http://127.0.0.1:${PORT}/"
cd "$ROOT"
exec python3 -m http.server "$PORT"
