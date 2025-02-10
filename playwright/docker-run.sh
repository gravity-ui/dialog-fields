#!/usr/bin/env bash

set -euo pipefail

IMAGE_NAME="mcr.microsoft.com/playwright"
IMAGE_TAG="v1.50.1-noble"
PW_VERSION=$(echo $IMAGE_TAG | awk -F "-" '{print $1}' | sed -e 's/^v//')

NAME=$(node -e 'console.log(require("./package.json").name)')
NODE_MODULES_CACHE_DIR="$HOME/.cache/$(basename $0)/$NAME"

echo Using cache directory: ${NODE_MODULES_CACHE_DIR}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

run_command() {
    toRun="$@"
    $CONTAINER_TOOL run --rm --network host -it -w /work \
        -v $(pwd):/work \
        -v "$NODE_MODULES_CACHE_DIR/node_modules:/work/node_modules" \
        -v "$NODE_MODULES_CACHE_DIR/.cache-playwright:/work/.cache-playwright" \
        "$IMAGE_NAME:$IMAGE_TAG" \
        /bin/bash -c "umask 0000; $toRun"
}

if command_exists docker; then
    CONTAINER_TOOL="docker"
elif command_exists podman; then
    CONTAINER_TOOL="podman"
else
    echo "Neither Docker nor Podman is installed on the system."
    exit 1
fi

action=${1:-test}

if [ "$1" = "clear-cache" ]; then
    rm -rf "$NODE_MODULES_CACHE_DIR"
    exit 0
fi

# Version of installed @playwright/test
VERSION=$(node -e 'console.log(require("./package-lock.json").packages["node_modules/@playwright/test"].version)')

if [[ "${VERSION}" != "${PW_VERSION}" ]]; then
    (
        echo -e "Error: insosistent version of @playwright/test"
        echo -e "  You have to install the same version of @playwright/test as used by the docker image:"
        echo -e "    Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
        echo -e "    @playwright/test: ${VERSION}\n"
    ) >&1
    exit 1
fi

checksumFile="${NODE_MODULES_CACHE_DIR}/package-lock.json.shasum"

if
    ! shasum -c "${checksumFile}" ||
        ! test -d "${NODE_MODULES_CACHE_DIR}"
then
    mkdir -p "$NODE_MODULES_CACHE_DIR/node_modules"
    mkdir -p "$NODE_MODULES_CACHE_DIR/.cache-playwright"

    run_command 'npm ci'
    shasum ./package-lock.json >"${checksumFile}"
fi

run_command $@
