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

sudo apt install -y openbox xinit chromium-browser protobuf-compiler

./build.sh

if $PRODUCTION
then
  SCRIPT_DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)"

  mkdir -p ~/.config/openbox
  echo -e "#!/bin/bash\ncd $SCRIPT_DIR\nexec ./start.sh" > ~/.config/openbox/autostart
  echo -e "#!/bin/bash\nexport VONK_ENV=production\nexec openbox-session" > ~/.xinitrc

  pnpm prune --prod
fi
