# Kinto Build Api

> Kinto-build is a GRPC API responsible for creating build/deployment workflows.

## Requirements

* Go version `1.13` or higher
* Kubernetes version `1.16` or higher if `WORKFLOW_ENGINE` == `argo` 
  * argo controller version `2.8.1` or higher

## Dependencies
- [kinto-core](https://github.com/kintoproj/kinto-core)
- [utils-go](https://github.com/kintohub/utils-go) our own reuseable utils functions

## Overview

It is called by [kinto-core](https://github.com/kintoproj/kinto-core).   
The API contracts are store under [there](https://github.com/kintoproj/kinto-core/blob/master/proto/workflowapi.proto).

Kinto-build supports
- [Argo](https://github.com/argoproj/argo) (current workflow system on KintoHub). Need an access to Kubernetes.

## Argo

1) Duplicate the `.env.example` file into a `.env` file.
2) Modify the variables if needed.
3) Pay attention to env var `ARGO_WORKFLOW_MAIN_IMAGE` (see [kinto-cli](../images/kinto-cli))
4) Pay attention to env var `ARGO_WORKFLOW_CLI_IMAGE` (see [workflow image](../images))

```shell script
$ go run cmd/main.go
{"level":"info","msg":"Successfully started server listening to port 8080","time":"2020-03-24T10:41:59+08:00"}
```