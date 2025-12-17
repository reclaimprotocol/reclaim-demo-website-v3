#!/usr/bin/env bash

(cd ./internal/mango; make build;) || exit 1;
mkdir -p public/mango;
cp ./internal/mango/build/mango.wasm ./public/mango/mango.wasm;
cp ./internal/mango/build/wasm_exec.js ./public/mango/wasm_exec.js
