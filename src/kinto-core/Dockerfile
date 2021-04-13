FROM golang:1.13-alpine as builder
RUN apk update && apk add --no-cache git
WORKDIR /app
COPY go.mod .
COPY go.sum .
COPY cmd/app ./cmd
COPY internal ./internal
COPY pkg ./pkg
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o app cmd/main.go

FROM alpine:3.9.3
WORKDIR /app
COPY --from=builder /app/app app
ENTRYPOINT ["/app/app"]
