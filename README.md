# Kinto-Core

> The core is the main API server called by the dashboard and the cli
> It is a GRPC server  that interacts with Kubernetes.
> It also contains the main types used by all the sub API (build, deploy, etc.).

## Requirements

* Go version `1.13` or higher
* Kubernetes version `1.16` or higher

## Dependencies
- [utils-go](https://github.com/kintohub/utils-go) our own reusable utils functions

## Configuration

The following table lists the configurable parameters of the core and their default values.

|            Parameter              |                                  Description                               |                           Default                        |        Required         |
|-----------------------------------|----------------------------------------------------------------------------|----------------------------------------------------------|-------------------------|
| `LOG_LEVEL`                       | Log levels from `verbose` to `panic`                                       | `debug`                                                  |                         |
| `KUBE_CONFIG_PATH`                | Only for local development                                                 |                                                          |                         |
| `GRPC_PORT`                       | GRPC port                                                                  | `8080`                                                   |                         |
| `GRPC_WEB_PORT`                   | GRPC web port                                                              | `8090`                                                   |                         |
| `CORS_ALLOWED_HOST`               | Specify the hosts allowed to call the server                               | `*`                                                      |                         |
| `CONSOLE_LOGS_HISTORY_SECONDS`    | Max time in seconds to query the logs                                      | `86400`                                                  |                         |
| `CONSOLE_LOGS_MAX_LINES_ON_START` | Max number of lines to query the logs                                      | `1000`                                                   |                         |
| `METRICS_UPDATE_TICK_SECONDS`     | Refresh frequency in seconds for querying the metrics                      | `5`                                                      |                         |
| `HEALTH_UPDATE_TICK_SECONDS`      | Refresh frequency in seconds for querying the health of the services       | `1`                                                      |                         |
| `KINTO_DOMAIN`                    | Domain/Subdomain used to create external name for api and web app services |                                                          | Yes                     |
| `BUILD_API_HOST`                  | `kinto-builder` api host                                                   | `kinto-builder:8080`                                     |                         |
| `ENABLE_SSL`                      | Enable or disable SSL certs for external URL                               | `false`                                                  |                         |
| `CERT_MANAGER_ISSUER_EMAIL`       | Email used on every certificate for every external service                 |                                                          | If `ENABLE_SSL == true` |
| `CERT_MANAGER_ISSUER_SERVER`      | Let's encrypt server                                                       | `https://acme-staging-v02.api.letsencrypt.org/directory` |                         |
| `KINTO_DEV_PROXY_ENABLED`         | Is kinto-cli allowed to connect                                            | `true`                                                   |                         |
| `PROXLESS_FQDN`                   | Proxless kubernetes FQDN                                                   | `kinto-proxless.kintohub.svc.cluster.local`              |                         |

## Development Setup

Duplicate the `.env.example` file into a `.env` file.  
Modify the variables if needed. See configuration above for more information.

```shell script
$ go run cmd/main.go
```

To regenerate `go` files from `.proto` run at root
```shell script
$ make generate_proto
```

## How to Test GRPC calls

We use [BloomRPC](https://github.com/uw-labs/bloomrpc)

- Import the proto files found in `./proto`
- The URL should be `localhost:PORT` (port is `GRPC_PORT` found in `.env`)

## Meta

https://www.kintohub.com
