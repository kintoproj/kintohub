package cmd_dockerfile

const javaDynamicTemplate = `
FROM openjdk:{{ .Tag }} as builder
RUN apt-get update && apt-get -y install maven
{{ range .BuildArgs }}
ARG {{ . }}
{{ end }}
WORKDIR /app
COPY . .
RUN {{ .BuildCommand }}
ENTRYPOINT {{ .RunCommand }}`
