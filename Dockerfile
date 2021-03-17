FROM node:alpine
MAINTAINER Remus Sepp

ADD . /opt/apps

WORKDIR /opt/apps
RUN npm i

CMD [ "node", "/opt/apps/cqrs"]