#!/bin/bash

if [[ -z $1 ]]; then
    echo 'ERROR: No target file given.'
    exit 1
fi

envsubst "\$UISERVER:\$SERVERNAME" < $1 > /etc/nginx/nginx.conf

cat /etc/nginx/nginx.conf

exec "${@:2}"
