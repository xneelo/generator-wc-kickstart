# Minimal image required to run the app ~150MB

FROM node:6.10.0-alpine

RUN apk update && apk upgrade;
RUN apk add --no-cache bash git openssh;

RUN mkdir /app
WORKDIR /app

RUN mkdir /app/node_modules
RUN mkdir /app/bower_components

ENV PATH /app/node_modules/.bin:$PATH

ADD bower.json /app
ADD package.json /app

RUN npm install -g bower
RUN bower update --production --allow-root
RUN npm install --production

ADD demo /app
ADD test /app