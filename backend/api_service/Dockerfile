FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY prisma ./prisma

COPY . .

CMD ["sh", "-c", "npx prisma generate && node src/app.js"]

EXPOSE 3000