#!/usr/bin/env bash

#CD_INSTALL_PATH#

source .venv/bin/activate
cd ./build
exec pnpm run start
