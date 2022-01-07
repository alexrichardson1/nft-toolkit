FROM node:16-alpine

WORKDIR /app

RUN apk add --update --no-cache \
    git \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake


COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn compile
RUN yarn build

EXPOSE 5000

CMD [ "yarn", "start-production" ]