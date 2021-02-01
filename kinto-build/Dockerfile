FROM golang:1.13-alpine as builder
RUN apk update && apk add --no-cache git
WORKDIR /app
ARG GIT_TOKEN
RUN git config --global url."https://${GIT_TOKEN}@github.com".insteadOf "https://github.com"
COPY go.mod .
COPY go.sum .
RUN GOPRIVATE=github.com/kintohub go mod download
COPY cmd ./cmd
COPY internal ./internal
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o app cmd/main.go

FROM scratch
WORKDIR /app
COPY --from=builder /app/app app
ENTRYPOINT ["/app/app"]
