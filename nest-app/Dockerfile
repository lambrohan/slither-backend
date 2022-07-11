FROM node:16.15.0

WORKDIR /app

COPY package*.json yarn.lock ./

COPY . .

RUN yarn

RUN npx prisma generate

RUN yarn build

EXPOSE 4000

CMD ["yarn","start"]