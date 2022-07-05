## Slither Backend
```
Backend Framework - NestJS
DB - PostgreSQL
```


## Docker Setup
1. Setup `.env` file with reference from `.env.example`
2. Run `docker-compose up -d --build`
3. Done 🚀


## Local Setup
```
 cd nest-app
```
then 
```bash
$ npm install or yarn
```

## Running the app

```bash
# development
$ npm run dev or yarn dev

# production mode
$ npm run start:prod
```

## Seeding the DB
`npx prisma seed`

it will create `ice` & `fire` rooms.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
