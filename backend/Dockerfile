FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["NODE_EXTRA_CA_CERTS=./src/bot/cert/MDD.pem", "node", "index.js"]