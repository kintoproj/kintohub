protoc -I . *.proto --go_out=plugins=grpc:../pkg/types --go_opt=paths=source_relative
