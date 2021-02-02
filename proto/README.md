# GRPC

GRPC uses protobuf files and a gRPC plugin to generate the required structures of your api(s) in any language.

To have this work with Golang, you must install grpc via `brew install grpc` command.
Then run `go get -u github.com/golang/protobuf/protoc-gen-go` to install `protoc-gen-go` dependency.

## Regenerating golang files

1) Make the changes you want in `kintokubecore.proto`
2) Run `./generate.sh`
3) You will find your changes in `/pkg/types/kintokubecore.pb.go`
4) Make sure if you are creating a new api, make validation functions in `/pkg/types/validation.go`
