# Kinto-cli

> CLI responsible for different tasks related to the workflow
> - cloning the git repo
> - generating the Dockerfile file when user select `Dockerfile` as language.
> - calling the kinto core server to update the release status in the configmap 

## Requirements

* Go version `1.13` or higher

## Dependencies
- [kinto-core](https://github.com/kintoproj/kinto-core)
- [utils-go](https://github.com/kintohub/utils-go) our own reusable utils functions

## Development setup

```shell script
go build -o ./kinto-cli main.go
```

## Commands

### Clone Repository

```shell script
kintocli git \
  --gitRepoURL="$GIT_INIT_REPO_URL" \
  --gitBranch="$GIT_INIT_BRANCH"
```

### Generate Dockerfile

```shell script
kintocli dockerfile \
  --language="$KINTO_CLI_DOCKERFILE_LANGUAGE" \
  --language-version="$KINTO_CLI_DOCKERFILE_LANGUAGE_VERSION" \
  --build-command="$KINTO_CLI_DOCKERFILE_BUILD_COMMAND" \
  --run-command="$KINTO_CLI_DOCKERFILE_RUN_COMMAND" \
  --output-path="$KINTO_CLI_DOCKERFILE_PATH_IN_REPO" \
  --output-path-to-static-build="$KINTO_CLI_DOCKERFILE_PATH_TO_STATIC_OUTPUT_IN_REPO" \
  --is-static-build="$KINTO_CLI_DOCKERFILE_IS_STATIC_BUILD" \
  $KINTO_CLI_DOCKERFILE_EXTRA_ARGS
```

### Update release status

```shell script
kinto-cli release status \
  --kintoCoreHost="$KINTO_CLI_RELEASE_STATUS_KINTO_CORE_HOST" \
  --kintoCoreOverTls="$KINTO_CLI_RELEASE_STATUS_IS_KINTO_CORE_OVER_TLS" \
  --kintoCoreSecretKey="$KINTO_CLI_RELEASE_STATUS_KINTO_CORE_SECRET_KEY" \
  --envId="$KINTO_CLI_RELEASE_STATUS_ENVIRONMENT_ID" \
  --blockName="$KINTO_CLI_RELEASE_STATUS_BLOCK_NAME" \
  --releaseId="$KINTO_CLI_RELEASE_STATUS_RELEASE_ID" \
  --status="$KINTO_CLI_RELEASE_STATUS_STATUS"
```

### Update release commit sha

```shell script
kintocli release commit \
  --kintoCoreHost="$KINTO_CLI_RELEASE_COMMIT_KINTO_CORE_HOST" \
  --kintoCoreOverTls="$KINTO_CLI_RELEASE_COMMIT_KINTO_CORE_OVER_TLS" \
  --kintoCoreSecretKey="$KINTO_CLI_RELEASE_COMMIT_KINTO_CORE_SECRET_KEY" \
  --envId="$KINTO_CLI_RELEASE_COMMIT_ENV_ID" \
  --blockName="$KINTO_CLI_RELEASE_COMMIT_BLOCK_NAME" \
  --releaseId="$KINTO_CLI_RELEASE_COMMIT_RELEASE_ID" \
  --commitSha="$(cat /workspace/.git/`cat /workspace/.git/HEAD | cut -d \  -f 2`)"
```