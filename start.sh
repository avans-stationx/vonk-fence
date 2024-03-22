#!/usr/bin/env bash

#CD_INSTALL_PATH#

source .venv/bin/activate

if [[ $* == --production ]]
then
  VONK_MOUNT_POINT=/media/vonk-storage
else
  VONK_MOUNT_POINT=photos
fi

export VONK_MOUNT_POINT=$VONK_MOUNT_POINT

if [[ $* == --production ]]
then
  if [[ ! -d "build" ]]
  then
    echo "Error starting, build the VONK project first! (pnpm run build)"
    exit 1
  fi

  sudo mkdir -p $VONK_MOUNT_POINT
  sudo mount /dev/sda1 $VONK_MOUNT_POINT -o uid=$USER -o gid=$USER
  mkdir -p $VONK_MOUNT_POINT/photos

  cd build
  export NODE_ENV=production
  exec node index.js

  sudo umount $VONK_MOUNT_POINT
  sudo rm -r $VONK_MOUNT_POINT
else
  mkdir -p $VONK_MOUNT_POINT
  exec nodemon src/runtime/index.ts
fi
