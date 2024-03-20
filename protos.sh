#!/bin/bash

PRODUCTION=build/generated_protos
SOURCE=src/runtime/generated_protos

if [[ $* == --production ]]
then
  OUTPUT=$PRODUCTION
else
  OUTPUT=$SOURCE
fi

mkdir -p $SOURCE $OUTPUT

pnpm pbjs --target static-module --wrap commonjs --es6 src/proto/*.proto | tee $SOURCE/protos.js | pnpm pbts --out $SOURCE/protos.d.ts -

if [[ $* == --production ]] || [[ $* == --include-python ]]
then
  protoc -I src/proto --python_out=$OUTPUT --mypy_out=$OUTPUT --proto_path=src/proto src/proto/*.proto
  protol --create-package --in-place --python-out $OUTPUT protoc --proto-path=src/proto src/proto/*.proto
fi
