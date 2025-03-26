FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN mkdir -p /app/logs && chmod 777 /app/logs

EXPOSE 4000

CMD ["node", "dist/main"] 