# step 1
FROM node:alpine as build

WORKDIR /usr/app/bug-tracker

COPY package.json .
COPY package-lock.json .

RUN npm i
COPY . .

RUN npm run build


# step 2
FROM node:alpine as prod

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app/bug-tracker

COPY package.json .
COPY package-lock.json .

RUN npm i --omit=dev

COPY --from=build /usr/app/bug-tracker/build ./build

CMD [ "node", "build/server.js" ]
