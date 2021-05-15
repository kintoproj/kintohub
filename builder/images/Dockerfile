# This Dockerfile will be used to build a single step docker image for the argo workflow
# We are doing that because we want to use `emptyDir` storage in order to speed up the workflow (persistent volume
# taking too much time to be created and mounted) and `emptyDir` is deleted after a pod is completed

### Build kinto-cli
FROM golang:1.13-alpine as kinto-cli
RUN apk update && apk add --no-cache git
WORKDIR /app
COPY kinto-cli/go.mod .
COPY kinto-cli/go.sum .
COPY kinto-cli/main.go .
COPY kinto-cli/cmd ./cmd
COPY kinto-cli/cmd-dockerfile ./cmd-dockerfile
COPY kinto-cli/cmd-release ./cmd-release
COPY kinto-cli/cmd-git ./cmd-git
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o kinto-cli main.go

### Build kinto-deploy
FROM golang:1.13-alpine as kinto-deploy
RUN apk update && apk add --no-cache git
WORKDIR /app
COPY kinto-deploy/go.mod .
COPY kinto-deploy/go.sum .
COPY kinto-deploy/cmd ./cmd
COPY kinto-deploy/internal ./internal
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o kinto-deploy cmd/main.go

# Main Image
FROM gcr.io/kaniko-project/executor:latest
## https://github.com/GoogleContainerTools/kaniko/blob/master/deploy/Dockerfile_debug
COPY --from=amd64/busybox:1.31.1 /bin /busybox
# Declare /busybox as a volume to get it automatically in the path to ignore
# kaniko will not delete this volume at the end of the build stage
VOLUME /busybox
ARG KINTO_PATH_ARG=/kaniko/kinto
COPY --from=kinto-cli /app/kinto-cli $KINTO_PATH_ARG/kintocli
COPY --from=kinto-deploy /app/kinto-deploy $KINTO_PATH_ARG/kintodeploy
COPY entrypoint.sh $KINTO_PATH_ARG
ENV PATH /usr/local/bin:/kaniko:/busybox:$KINTO_PATH_ARG
ENV KINTO_PATH=$KINTO_PATH_ARG
ENTRYPOINT ["sh"]
CMD ["/kaniko/kinto/entrypoint.sh"]
