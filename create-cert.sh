#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;93m'
NC='\033[0m'


source ./.env-development

echo $DOMAIN

openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout "${DOMAIN}".key \
    -new \
    -out "${DOMAIN}".crt \
    -subj /CN="${DOMAIN}" \
    -reqexts SAN \
    -extensions SAN \
    -config <(cat $OPENSSL_CNF_PATH \
        <(printf '[SAN]\nsubjectAltName=DNS:'${DOMAIN})) \
    -sha256 \
    -days 3650

rm -rf ./certs/*
mkdir -p ./certs

mv *.crt ./certs/
mv *.key ./certs/

echo -e ${GREEN}"Cert created in /cert! ${NC}"
