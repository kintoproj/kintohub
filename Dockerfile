FROM node:12-alpine

RUN apk update && apk add --no-cache bash git ca-certificates

WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
# disable lint
ENV CI=false
RUN yarn install --prod
COPY . .
RUN NODE_ENV=production yarn build

FROM nginx:1.18

WORKDIR /usr/share/nginx/html
COPY --from=0 /usr/src/app/build .
COPY --from=0 /usr/src/app/scripts/replaceEnvVars.sh .

COPY --from=0 /usr/src/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ./replaceEnvVars.sh && nginx -g 'daemon off;'
