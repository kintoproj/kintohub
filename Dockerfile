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

FROM node:12-alpine
RUN apk update && apk add --no-cache bash git
RUN yarn global add serve
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app/build .
COPY --from=0 /usr/src/app/scripts/replaceEnvVars.sh .
EXPOSE 5000

# avoid building everytime
ARG GITHUB_SHA_ARG
ENV GITHUB_SHA=$GITHUB_SHA_ARG

CMD ./replaceEnvVars.sh && serve -s .
