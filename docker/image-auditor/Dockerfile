FROM node:4.3.1
LABEL maintainer="nohan.budry@heig-vd.ch"

COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

ENTRYPOINT ["node", "/opt/app/index.js"]