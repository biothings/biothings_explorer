FROM node:15-alpine

ENV NODE_ENV production

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

RUN npm i -g pm2

COPY --chown=node:node package*.json process.yml ./

USER node

RUN npm i

COPY --chown=node:node . .

EXPOSE 3000

ENTRYPOINT [ "pm2-runtime", "./process.yml" ]