#!/bin/bash

set -e

echo "Script replacing dynamically environment variables in all files"
echo " usage replaceEnvVars.sh BUILD_PATH"
echo " default BUILD_PATH = ."
echo

BUILD_PATH="."
if [ -n "$1" ]; then
  BUILD_PATH=$1
fi

echo "Replacing environment variables"

replace() {
    find $BUILD_PATH/ -name '*.js' | xargs sed -i "s|{$1}|$2|g"
    find $BUILD_PATH/ -name '*.html' | xargs sed -i "s|{$1}|$2|g"
}

replace REACT_APP_SERVER_URL ${REACT_APP_SERVER_URL}
replace REACT_APP_ALPHA_FEATURE_ENABLED ${REACT_APP_ALPHA_FEATURE_ENABLED}
replace REACT_APP_SLEEP_MODE_TTL_MINUTES ${REACT_APP_SLEEP_MODE_TTL_MINUTES}
replace REACT_APP_LOCAL_STORAGE_VERSION ${REACT_APP_LOCAL_STORAGE_VERSION}

# as release version on sentry
replace GITHUB_SHA ${GITHUB_SHA}

# clean up all .map files
# Attension: on the github actions we have the action that upload sourcemap to sentry
# which is overriding the entrypoint, so this file will not be triggered
rm -rf $BUILD_PATH/static/js/*.map

echo "Done"
