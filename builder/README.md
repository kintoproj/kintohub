# Kinto Builder
[![slack](https://img.shields.io/badge/slack-kintoproj-brightgreen)](https://slack.kintohub.com)

Kinto Builder is a mono repository containing all the dependencies related to Building and Deploying services on KintoHub.

## Structure

### [Kinto Build](./kinto-build)

Kinto Build is a gRPC server responsible for creating build/deployment argo workflows.

### [Images](./images)

#### [Kinto CLI](./images/kinto-cli)

Kinto CLI responsible for different tasks related to the workflow:

- Cloning the git repository.
- Generating the Dockerfile file when user select `Dockerfile` as language.
- Calling the kinto core server to update the release status in the configmap.

#### [Kinto Deploy](./images/kinto-deploy)

Kinto Deploy is service responsible for deploying a KintoHub service.

## How to use it

Follow instructions in [Kinto Build README](./kinto-build/README.md).

### Dockerfiles

- `./images/Dockerfile` => `kintohub/kinto-workflow-main`
- `./kinto-build/Dockerfile` => `kintohub/kinto-workflow-cli`
