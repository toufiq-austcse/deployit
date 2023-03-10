FROM node:16 as base

WORKDIR /app
COPY package.json \
  ./

RUN yarn --production
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune

# lint and formatting configs are commented out
# uncomment if you want to add them into the build process

FROM base AS dev
COPY nest-cli.json \
  tsconfig.* \
   ormconfig.ts \
#  .eslintrc.js \
#  .prettierrc \
  ./
# bring in src from context
COPY ./src/ ./src/
COPY ./migrations/ ./migrations/
RUN yarn
# RUN yarn lint
RUN yarn build

# use one of the smallest images possible
FROM node:16-alpine
RUN npm install -g typeorm
# get the node_modules from the intial cache
COPY --from=base /app/node_modules/ ./node_modules/
RUN apk add git
RUN apk add docker
# get package.json from base
COPY --from=base /app/package.json ./
# get the dist back
COPY --from=dev /app/dist/ ./dist/
# expose application port
EXPOSE 3000
# start
CMD ["node", "dist/src/main.js"]