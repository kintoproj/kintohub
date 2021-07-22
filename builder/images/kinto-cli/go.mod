module github.com/kintoproj/kintohub/cli

go 1.13

require (
	github.com/go-git/go-git/v5 v5.1.0
	github.com/golang/protobuf v1.4.3
	github.com/kintoproj/kintohub/core v0.0.0
	github.com/spf13/cobra v1.0.0
	github.com/ttacon/chalk v0.0.0-20160626202418-22c06c80ed31
	google.golang.org/grpc v1.38.0
)

replace github.com/kintoproj/kintohub/core => ./core