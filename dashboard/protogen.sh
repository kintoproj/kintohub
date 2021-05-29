# Path to this plugin
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./src/types/proto"

mkdir -p $OUT_DIR

protoc \
  --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
  --js_out="import_style=commonjs,binary:${OUT_DIR}" \
  --ts_out="service=grpc-web:${OUT_DIR}" \
  -I../core/proto \
  ../core/proto/*.proto

