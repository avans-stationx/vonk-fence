#!/bin/bash

export VONK_ENV=build
./protos.sh --production
pnpm tsc --project src/runtime
pnpm next build
cp src/runtime/camera.py build
