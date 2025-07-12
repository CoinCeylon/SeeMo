FROM node:20.4.0-alpine
LABEL authors="PethumJeewantha"

RUN mkdir /app

RUN apk update

WORKDIR /app

COPY package*.json ./

RUN chown -R node:node /app
USER node
RUN npm ci

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "node", "server.mjs" ]
