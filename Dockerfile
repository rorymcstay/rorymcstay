##################
## node_modules
FROM mhart/alpine-node:11 AS builder

WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY src src
COPY .env .env
COPY public public

RUN yarn run build

##################
## Server Build
FROM nginx

WORKDIR /etc/nginx

COPY --from=builder /usr/src/app/build /var/www
COPY nginx.template.conf /etc/nginx/
COPY run_nginx.sh /etc/nginx/run_nginx.sh

ENV UISERVER=http://ui-server:5000
ENV SERVERNAME=feed-admin
ENV MYVARS="$UISERVER:$SERVERNAME"

EXPOSE 80

ENTRYPOINT ["/etc/nginx/run_nginx.sh", "/etc/nginx/nginx.template.conf"]
CMD ["nginx", "-g", "daemon off;"]

