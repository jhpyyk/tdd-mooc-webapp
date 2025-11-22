FROM node:24

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]
COPY ./src ./src
RUN npm ci
CMD npm run dev