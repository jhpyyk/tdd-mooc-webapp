FROM node:24
RUN useradd -ms /bin/sh -u 1002 back 
USER back

WORKDIR /usr/src/backend
COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]
COPY --chown=back:back ./src ./src

RUN npm ci
CMD npm run dev