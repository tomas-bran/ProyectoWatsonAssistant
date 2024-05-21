FROM registry.access.redhat.com/ubi8/nodejs-16-minimal:1

WORKDIR /opt/app-root/src

COPY . /opt/app-root/src
RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
