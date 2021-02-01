# Kinto Deploy

> Deploy a kintohub service into a namespace

## Notes

- Kinto-deploy could be integrated into `kinto-cli`

## Requirements

* Go version `1.13` or higher
* Kubernetes version `1.16`

## Overview

Kinto-deploy retrieves the configmap containing the release information and create the appropriate kubernetes resources.

## ClusterRole Needed

Check the cluster role in the [kinto-kube-infra repo](https://github.com/kintohub/kinto-kube-infra/blob/master/charts/kinto-worker/templates/kinto-agent-cluster-role.yaml).

## Development Setup

Duplicate the `.env.example` file into a `.env` file and modify the variables accordingly

Then run

```shell script
$ go run cmd/main.go
```

