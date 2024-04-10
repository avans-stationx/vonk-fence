#!/usr/bin/env bash

get_device_path() {
  REGEX='^PATH="(.+)" LABEL="vonk"*'
  DEVICES="$(lsblk --pairs --output path,label --shell)"

  echo "$DEVICES" | while read DEVICE
  do
    if [[ $DEVICE =~ $REGEX ]]
    then
      DEVICE_PATH="${BASH_REMATCH[1]}"
      echo $DEVICE_PATH
    fi
  done
}

source .venv/bin/activate

if [[ $VONK_ENV == production ]] || [[ $* == --production ]]
then
  VONK_MOUNT_POINT=/media/vonk-storage
else
  VONK_MOUNT_POINT=storage
fi

export VONK_MOUNT_POINT=$VONK_MOUNT_POINT

if [[ $* == --frontend-only ]]
then
  exec pnpm next dev
  exit
fi

if [[ $* == --remote ]]
then
  export RUN_LOCATION=remote
fi

if [[ $VONK_ENV == production ]] || [[ $* == --production ]]
then
  if [[ ! -d "build" ]]
  then
    echo "Error starting, build the VONK project first! (pnpm run build)"
    exit 1
  fi

  sudo mkdir -p $VONK_MOUNT_POINT

  sudo mount $(get_device_path) $VONK_MOUNT_POINT -o uid=$USER -o gid=$USER
  mkdir -p $VONK_MOUNT_POINT/photos

  cd build
  export NODE_ENV=production
  exec node index.js
else
  mkdir -p $VONK_MOUNT_POINT/photos
  exec pnpm nodemon src/runtime/index.ts
fi
