FROM mhart/alpine-node:11 AS builder
WORKDIR /usr/src/app

COPY package.json ./
# this uses docker caching
RUN yarn install

COPY src src
COPY .env .env
COPY public public

RUN yarn run build

FROM mhart/alpine-node

RUN yarn global add serve

COPY --from=builder /usr/src/app/build .

CMD ["serve", "-p", "80", "-s", "."]