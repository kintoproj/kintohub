FROM scratch as core
WORKDIR /app
COPY core/go.mod .
COPY core/go.sum .
COPY core/cmd/app ./cmd
COPY core/internal ./internal
COPY core/pkg ./pkg

FROM golang:1.13-alpine as builder
ARG CLI_VERSION=v0.0.1
WORKDIR /app
COPY cli/go.mod .
COPY cli/go.sum .
COPY cli/main.go .
COPY cli/internal ./internal
COPY --from=core /app /app/core
RUN GOOS=linux GOARCH=amd64 go build -ldflags="-X 'github.com/kintoproj/kintohub/cli/internal/config.Version=${CLI_VERSION}'" -o kinto main.go

FROM alpine
COPY --from=builder /app/kinto /bin
ENTRYPOINT ["kinto"]
