FROM alpine-node:10 AS builder
WORKDIR /usr/src/app

COPY package.json ./
# this uses docker caching
RUN yarn install

COPY src src
COPY .env .env
COPY public public

RUN yarn run build

RUN yarn global add server

CMD ["serve", "-p", "80", "-s", "."]