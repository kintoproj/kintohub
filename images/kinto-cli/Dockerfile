FROM golang:1.13-alpine as builder
RUN apk update && apk add --no-cache git
WORKDIR /app
COPY go.mod .
COPY go.sum .
COPY main.go .
COPY cmd ./cmd
COPY cmd-dockerfile ./cmd-dockerfile
COPY cmd-release ./cmd-release
COPY cmd-git ./cmd-git
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o kinto main.go

FROM scratch
WORKDIR /app
COPY --from=builder /app/kinto kinto
ENTRYPOINT ["/app/kinto"]
