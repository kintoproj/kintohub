# Kinto Core
[![slack](https://img.shields.io/badge/slack-kintoproj-brightgreen)](https://slack.kintohub.com)

> The core is the main API server called by the dashboard and the cli
> It is a GRPC server  that interacts with Kubernetes.
> It also contains the main types used by all the sub API (build, deploy, etc.).

## Requirements

* Go version `1.13` or higher
* Kubernetes version `1.16` or higher

## Dependencies
- [utils-go](https://github.com/kintohub/utils-go) our own reusable utils functions

## Development Setup

Duplicate the `.env.example` file into a `.env` file.  
Modify the variables if needed.

```shell script
$ go run cmd/main.go
```

To regenerate `go` files from `.proto` run at root
```shell script
$ make generate_proto
```

## How to Test GRPC calls

We use [BloomRPC](https://github.com/uw-labs/bloomrpc)

- Import the proto files found in `./proto`
- The URL should be `localhost:PORT` (port is `GRPC_PORT` found in `.env`)

## Meta

https://www.kintohub.com
