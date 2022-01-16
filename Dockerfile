# Build Stage
FROM node:16.13-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# NodeModules
FROM node:16.13-alpine as moduleInstaller

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production=true --frozen-lockfile && yarn cache clean

# Production
FROM node:16.13-alpine

RUN mkdir -p /home/node/app/files/tmp

RUN chown node /home/node/app/files/tmp

USER node

WORKDIR /home/node/app

COPY --from=builder /app/dist ./dist
COPY --from=moduleInstaller /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]
