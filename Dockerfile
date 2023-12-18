FROM ghcr.io/puppeteer/puppeteer:latest

MAINTAINER weiqlog@126.com

RUN mkdir -p /pdfG

WORKDIR /pdfG

COPY package*.json ./

RUN npm instal

COPY . .

EXPOSE 10030

ENTRYPOINT ["node", "main.js", "10030"]

