FROM golang:1.13-alpine as builder
ARG CLI_VERSION=v0.0.1
WORKDIR /app
COPY go.mod .
COPY go.sum .
COPY main.go .
COPY internal ./internal
RUN GOOS=linux GOARCH=amd64 go build -ldflags="-X 'github.com/kintoproj/kinto-cli/internal/config.Version=${CLI_VERSION}'" -o kinto main.go

FROM alpine
WORKDIR /app
COPY --from=builder /app .
ENTRYPOINT ["/app/kinto"]
