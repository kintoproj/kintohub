package cmd_dockerfile

const rustDynamicTemplate = `
FROM rust:{{ .Tag }} as builder

{{ range .BuildArgs }}
ARG {{ . }}
{{ end }}

WORKDIR /app
COPY . .
RUN {{ .BuildCommand }}

ENTRYPOINT {{ .RunCommand }}`
