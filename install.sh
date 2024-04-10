#!/bin/bash

if [[ $* == --production ]]
then
  export VONK_ENV=production
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

sudo apt install -y xserver-xorg raspberrypi-ui-mods chromium-browser protobuf-compiler

./build.sh

if $PRODUCTION
then
  SCRIPT_DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)"

  sudo useradd --system vonk
  sudo chown vonk:vonk "$SCRIPT_DIR"
  sudo sed "s@#WorkingDirectory#@WorkingDirectory=$SCRIPT_DIR@g" > /etc/systemd/system/vonk.service
  sudo systemctl enable vonk
  sudo systemctl start vonk

  sudo raspi-config nonint do_blanking
  sudo raspi-config nonint do_vnc 1
  sudo raspi-config nonint do_boot_behaviour B4

  pnpm prune --prod

  sudo shutdown -r now
fi
