package cmd_dockerfile

const golangDynamicTemplate = `
FROM golang:{{ .Tag }} as builder
{{ range .BuildArgs }}
ARG {{ . }}
{{ end }}
WORKDIR $GOPATH/app
COPY . .
RUN {{ .BuildCommand }}
ENTRYPOINT {{ .RunCommand }}`

// TODO see how we wanna handle frameworks and their tags later
const golangStaticTemplate = `
FROM klakegg/hugo:0.78.0-alpine as builder
{{ range .BuildArgs }}
ARG {{ . }}
{{ end }}
WORKDIR $GOPATH/app
COPY . .
RUN {{ .BuildCommand }}

FROM nginx:1.15.11-alpine
EXPOSE 80
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/{{ .BuildPath }} /usr/share/nginx/html/
## https://stackoverflow.com/questions/18439528/sed-insert-line-with-spaces-to-a-specific-line
RUN sed -i '/location \/ {/a \ \ \ \ \ \ \ \ try_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf`
