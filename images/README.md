# Workflow Image

> Main image used as a one-step build/deploy workflow

## Note

- We decided to merge all the different steps (clone, build, deploy) to make the workflow faster
- The image created must be used in the environment variable `ARGO_WORKFLOW_MAIN_IMAGE` of the [kinto-build](../kinto-build/.env-example).

## Overview

The Dockerfile build `kinto-cli` and `kinto-deploy` and add their binaries into a [kaniko](https://github.com/GoogleContainerTools/kaniko) image.

/!\ It's not recommended to override the kaniko image. Be extra careful if you change anything.