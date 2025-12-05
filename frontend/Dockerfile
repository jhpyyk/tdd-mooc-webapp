FROM node:24

WORKDIR /usr/src/frontend
COPY ["package.json", "package-lock.json", "tsconfig.json", "vite.config.ts", "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json", "index.html", "./"]
COPY ./src ./src
RUN npm i
CMD npm run dev