package cmd_dockerfile

const pythonDynamicTemplate = `
FROM python:{{ .Tag }} as builder
{{ range .BuildArgs }}
ARG {{ . }}
{{ end }}
WORKDIR /app
COPY . .
RUN {{ .BuildCommand }}
ENTRYPOINT {{ .RunCommand }}`
