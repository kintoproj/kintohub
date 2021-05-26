# Kinto Deploy

Deploy KintoHub service into a namespace.

- Kinto Deploy could be integrated into `kinto-cli`.

## Overview

Kinto Deploy retrieves the configmap containing the release information and create the appropriate Kubernetes resources.

## Requirements

- Go version `1.13` or higher
- Kubernetes version `1.16`

## Dependencies

- [kinto-core](../../../core)
- [go-utils](https://github.com/kintoproj/go-utils)

## ClusterRole Needed

Check the cluster role in the [kinto-helm](https://github.com/kintoproj/kinto-helm) repository.

## Development Setup

Duplicate the `.env.example` file into a `.env` file and modify the variables accordingly.

Then run:

```shell script
$ go run cmd/main.go
```
