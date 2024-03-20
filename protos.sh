#!/bin/bash

if [[ $* == --production ]]
then
  OUTPUT=build/generated_protos
else
  OUTPUT=src/runtime/generated_protos
fi

mkdir -p $OUTPUT

pnpm pbjs --target static-module --wrap commonjs --es6 src/proto/*.proto | tee $OUTPUT/protos.js | pnpm pbts --out $OUTPUT/protos.d.ts -
protoc -I src/proto --python_out=$OUTPUT --mypy_out=$OUTPUT --proto_path=src/proto src/proto/*.proto
