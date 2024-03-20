#!/usr/bin/env bash

if [[ $* == *--flag* ]]
then
  cd #INSTALL_PATH#
fi

source .venv/bin/activate
cd ./build
pnpm run start
