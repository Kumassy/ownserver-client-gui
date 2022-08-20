#!/bin/bash
cat ./package.json | jq -r .version
cat ./src-tauri/tauri.conf.json | jq -r .package.version
cat ./src-tauri/Cargo.toml | sed -nE '/^version = /p;' | sed -E 's/version = //' | xargs
