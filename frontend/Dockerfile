FROM node:16.13.1-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4100

CMD ["npm", "start"]
