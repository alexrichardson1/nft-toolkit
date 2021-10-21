FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN apk add --no-cache git
RUN yarn

COPY . .

RUN yarn compile
RUN yarn build

EXPOSE 5000

CMD [ "yarn", "start-production" ]