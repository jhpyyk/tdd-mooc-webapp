# FROM node:24
# WORKDIR /usr/src/frontend
# COPY package*.json .
# RUN npm ci
# COPY . .
# EXPOSE 5173
# CMD npm run dev

FROM node:24

WORKDIR /usr/src/frontend
COPY ["package.json", "package-lock.json", "tsconfig.json", "vite.config.ts", "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json", "index.html", "./"]
COPY ./src ./src
RUN npm ci
CMD npm run dev