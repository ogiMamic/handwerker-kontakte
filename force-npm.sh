#!/bin/bash
# Ukloni pnpm fajlove
rm -f pnpm-lock.yaml
rm -f yarn.lock

# Kreiraj npm lock file
npm install --package-lock-only --legacy-peer-deps

echo "Forced npm package manager"
