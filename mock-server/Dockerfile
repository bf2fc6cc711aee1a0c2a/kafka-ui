FROM node:16 as compile-server
WORKDIR /usr/src/app
COPY . .
RUN npm install

CMD [ "npm", "start" ]