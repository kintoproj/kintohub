package cmd_dockerfile

const elixirDynamicTemplate = `
FROM elixir:{{ .Tag }} as builder

{{ range .BuildArgs }}
ARG {{ . }}
{{ end }}

WORKDIR /app
COPY . .
RUN {{ .BuildCommand }}

ENTRYPOINT {{ .RunCommand }}`
