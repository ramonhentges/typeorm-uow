FROM node:22-alpine

RUN apk add --no-cache bash

RUN chmod +x /home/node/app/.docker/entrypoint.sh

USER node

WORKDIR /home/node/app