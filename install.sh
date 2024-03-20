#!/bin/bash

curl -fsSL https://deb.nodesource.com/setup_21.x | sudo bash -
sudo apt install -y nodejs
sudo npm install pnpm --global
pnpm install

python -m venv .venv --system-site-packages
source .venv/bin/activate
pip install -r requirements.txt

sudo apt install -y protobuf-compiler
pnpm run generate:protos:build

pnpm run build

SCRIPT_DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)"

cp -p start.sh ~/.xinitrc
sed -i "s@#INSTALL_PATH#@$SCRIPT_DIR@g" ~/.xinitrc
ln -s ~/.xinitrc ~/.xsession
