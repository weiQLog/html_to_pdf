FROM ghcr.io/puppeteer/puppeteer:latest

MAINTAINER weiqlog@126.com

USER root

RUN mkdir -p /pdfG

WORKDIR /pdfG

COPY package*.json ./

COPY . .

RUN npm instal

EXPOSE 10030

ENTRYPOINT ["node", "main.js", "10030"]

