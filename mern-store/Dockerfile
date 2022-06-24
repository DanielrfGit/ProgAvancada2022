FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

EXPOSE 3000

ENTRYPOINT ["npm", "start"]