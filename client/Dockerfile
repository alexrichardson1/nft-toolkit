FROM node:16 as build
WORKDIR /app
COPY . .
RUN yarn

ARG AWS_ACCESS_KEY_ID
ENV REACT_APP_AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ENV REACT_APP_AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

RUN yarn run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html