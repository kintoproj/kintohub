FROM scratch as core
WORKDIR /app
COPY core/go.mod .
COPY core/go.sum .
COPY core/cmd/app ./cmd
COPY core/internal ./internal
COPY core/pkg ./pkg

FROM golang:1.13-alpine as builder
RUN apk update && apk add --no-cache git
WORKDIR /app
COPY builder/images/kinto-cli/go.mod .
COPY builder/images/kinto-cli/go.sum .
COPY builder/images/kinto-cli/main.go .
COPY builder/images/kinto-cli/cmd ./cmd
COPY builder/images/kinto-cli/cmd-dockerfile ./cmd-dockerfile
COPY builder/images/kinto-cli/cmd-release ./cmd-release
COPY builder/images/kinto-cli/cmd-git ./cmd-git
COPY --from=core /app /app/core
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o kinto main.go

FROM scratch
WORKDIR /app
COPY --from=builder /app/kinto kinto
ENTRYPOINT ["/app/kinto"]
