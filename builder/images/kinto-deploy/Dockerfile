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
COPY builder/images/kinto-deploy/go.mod .
COPY builder/images/kinto-deploy/go.sum .
COPY builder/images/kinto-deploy/cmd ./cmd
COPY builder/images/kinto-deploy/internal ./internal
COPY --from=core /app /app/core
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o kkd cmd/main.go

FROM scratch
WORKDIR /app
COPY --from=builder /app/kkd kkd
ENTRYPOINT ["/app/kkd"]
