# Kinto Builder
[![slack](https://img.shields.io/badge/slack-kintoproj-brightgreen)](https://slack.kintohub.com)

Kinto Builder is a mono repository containing all the dependencies related to Building and Deploying services on KintoHub.

## Structure

### [kinto-build](./kinto-build)

Kinto-build is a gRPC server responsible for creating build/deployment argo workflows.

### [images](./images)

#### [kinto-cli](./images/kinto-cli)

CLI responsible for different tasks related to the workflow:

- cloning the git repository.
- generating the Dockerfile file when user select `Dockerfile` as language.
- calling the kinto core server to update the release status in the configmap.

#### [kinto-deploy](./images/kinto-deploy)

Service responsible for deploying a KintoHub service.

## How to use it

Follow instructions in [kinto-build README](./kinto-build/README.md).

### Dockerfiles

- `./images/Dockerfile` => `kintohub/kinto-workflow-main`
- `./kinto-build/Dockerfile` => `kintohub/kinto-workflow-cli`

## Meta

https://www.kintohub.com
