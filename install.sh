#!/bin/bash

if [[ $* == --production ]]
then
  PRODUCTION=true
else
  PRODUCTION=false
fi

curl -fsSL https://deb.nodesource.com/setup_21.x | sudo bash -
sudo apt install -y nodejs
sudo npm install pnpm --global
pnpm install

python -m venv .venv --system-site-packages
source .venv/bin/activate
pip install -r requirements.txt

sudo apt install -y protobuf-compiler

if $PRODUCTION
then
  pnpm run generate:protos:build
fi

pnpm run build

if $PRODUCTION
then
  SCRIPT_DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)"

  cp -p start.sh ~/.xinitrc
  sed -i "s@#CD_INSTALL_PATH#@cd $SCRIPT_DIR@g" ~/.xinitrc
  ln -s ~/.xinitrc ~/.xsession
fi
