package cmd_dockerfile

const phpDynamicTemplate = `
FROM php:{{ .Tag }} as builder
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
{{ range .BuildArgs }}
ARG {{ . }}
{{ end }}
WORKDIR /app
COPY . .
RUN {{ .BuildCommand }}
ENTRYPOINT {{ .RunCommand }}`
