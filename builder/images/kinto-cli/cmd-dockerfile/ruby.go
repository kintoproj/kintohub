package cmd_dockerfile

const rubyDynamicTemplate = `
FROM ruby:{{ .Tag }} as builder
RUN gem install bundler
{{ range .BuildArgs }}
ARG {{ . }}
{{ end }}
WORKDIR /app
COPY . .
RUN {{ .BuildCommand }}
ENTRYPOINT {{ .RunCommand }}`

const rubyStaticTemplate = `
FROM ruby:{{ .Tag }} as builder
RUN gem install bundler
{{ range .BuildArgs }}
ARG {{ . }}
{{ end }}
WORKDIR /app
COPY . .
RUN {{ .BuildCommand }}

FROM nginx:1.15.11-alpine
EXPOSE 80
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/{{ .BuildPath }} /usr/share/nginx/html/
## https://stackoverflow.com/questions/18439528/sed-insert-line-with-spaces-to-a-specific-line
RUN sed -i '/location \/ {/a \ \ \ \ \ \ \ \ try_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf`
