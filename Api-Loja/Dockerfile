FROM node:latest

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 3030

CMD ["node", "api-loja.js"]