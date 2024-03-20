#!/bin/bash

curl -fsSL https://deb.nodesource.com/setup_21.x | bash -
sudo apt install -y nodejs
npm install pnpm
pnpm install

python -m venv .venv --system-site-packages
source .venv/bin/activate
pip install .

sudo apt install -y protobuf
pnpm run generate:protos:build

pnpm run build

SCRIPT_DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)"

cp -p start.sh ~/.xinitrc
sed -i "s/#INSTALL_PATH#/$SCRIPT_DIR/g" ~/.xinitrc
ln -s ~/.xinitrc ~/.xsession
