# Copyright Strimzi authors.
# License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
# Stage 1 - the build process
FROM node:10 as compile-server
WORKDIR /usr/src/app
COPY . .
RUN npm install

CMD [ "npm", "start" ]