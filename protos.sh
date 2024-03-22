#!/bin/bash

generate_javascript_protos() {
  local path=$1
  pnpm pbjs --target static-module --wrap commonjs --es6 src/proto/*.proto |
  tee $path/protos.js |
  pnpm pbts --out $path/protos.d.ts -
}

PRODUCTION=build/generated_protos
SOURCE=src/runtime/generated_protos

if [[ $* == --production ]]
then
  OUTPUT=$PRODUCTION
else
  OUTPUT=$SOURCE
fi

mkdir -p $SOURCE $OUTPUT

generate_javascript_protos $SOURCE

if [[ $* == --production ]]
then
  cp $SOURCE/protos.js $SOURCE/protos.d.ts $PRODUCTION
fi

if [[ $* == --production ]] || [[ $* == --include-python ]]
then
  protoc -I src/proto --python_out=$OUTPUT --mypy_out=$OUTPUT --proto_path=src/proto src/proto/*.proto
  protol --create-package --in-place --python-out $OUTPUT protoc --proto-path=src/proto src/proto/*.proto
fi
