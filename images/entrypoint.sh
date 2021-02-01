set -e

if [ "$KINTO_CLI_GIT_INIT_ENABLED" == "true" ]; then
  echo "Retrieving code from repository..."

  "$KINTO_PATH"/kintocli git \
    --gitRepoURL="$KINTO_CLI_GIT_INIT_REPO_URL" \
    --gitBranch="$KINTO_CLI_GIT_INIT_BRANCH" \
    --workdir=/workspace || exit

  "$KINTO_PATH"/kintocli release commit \
    --kintoCoreHost="$KINTO_CLI_RELEASE_COMMIT_KINTO_CORE_HOST" \
    --kintoCoreOverTls="$KINTO_CLI_RELEASE_COMMIT_KINTO_CORE_OVER_TLS" \
    --envId="$KINTO_CLI_RELEASE_COMMIT_ENV_ID" \
    --blockName="$KINTO_CLI_RELEASE_COMMIT_BLOCK_NAME" \
    --releaseId="$KINTO_CLI_RELEASE_COMMIT_RELEASE_ID" \
    --commitSha="$(cat /workspace/.git/`cat /workspace/.git/HEAD | cut -d \  -f 2`)" || exit
fi

if [ "$KINTO_CLI_DOCKERFILE_ENABLED" == "true" ]; then
  echo "Generating configuration for build service..."

  "$KINTO_PATH"/kintocli dockerfile \
    --language="$KINTO_CLI_DOCKERFILE_LANGUAGE" \
    --language-version="$KINTO_CLI_DOCKERFILE_LANGUAGE_VERSION" \
    --build-command="$KINTO_CLI_DOCKERFILE_BUILD_COMMAND" \
    --run-command="$KINTO_CLI_DOCKERFILE_RUN_COMMAND" \
    --output-path="$KINTO_CLI_DOCKERFILE_PATH_IN_REPO" \
    --output-path-to-static-build="$KINTO_CLI_DOCKERFILE_PATH_TO_STATIC_OUTPUT_IN_REPO" \
    --is-static-build="$KINTO_CLI_DOCKERFILE_IS_STATIC_BUILD" \
    $KINTO_CLI_DOCKERFILE_EXTRA_ARGS || exit 1
fi

if [ "$BUILD_SVC_ENABLED" == "true" ]; then
  echo "Building service..."

  /kaniko/executor \
    --destination="$BUILD_SVC_IMAGE" \
    --cache=true \
    --cache-ttl=72h \
    --context="$BUILD_SVC_PATH_IN_REPO" \
    --dockerfile="$BUILD_SVC_PATH_IN_REPO/$BUILD_SVC_DOCKERFILE_NAME" \
    $BUILD_SVC_EXTRA_ARGS || exit 1
fi

## Check for specific VPN binaries and kill the build if found
which /v2ray 2>&1 >/dev/null && echo -e "Default \e[31mProblem happened. Please contact support\e[39m"
which v2ray 2>&1 >/dev/null && echo -e "Default \e[31mProblem happened. Please contact support\e[39m"
which /v2ctl 2>&1 >/dev/null && echo -e "Default \e[31mProblem happened. Please contact support\e[39m"
which v2ctl 2>&1 >/dev/null && echo -e "Default \e[31mProblem happened. Please contact support\e[39m"
which /yingsuo 2>&1 >/dev/null && echo -e "Default \e[31mProblem happened. Please contact support\e[39m"
which yingsuo 2>&1 >/dev/null && echo -e "Default \e[31mProblem happened. Please contact support\e[39m"

echo "Deploying service..."

# check environment variables needed for `kinto-deploy`
"$KINTO_PATH"/kintodeploy || exit 1
