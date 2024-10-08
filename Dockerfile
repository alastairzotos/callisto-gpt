FROM node:20-alpine as builder

WORKDIR /app

ARG SCOPE
ARG PORT

COPY . .
RUN yarn global add turbo@2.0.13 && \
    turbo prune --scope=${SCOPE} && \
    cd out && \
    yarn install && \
    turbo run build --filter=${SCOPE} && \
    rm -rf node_modules/.cache .yarn/cache

FROM node:20-alpine as app

ARG SCOPE
ARG PORT

ENV NODE_ENV=production

WORKDIR /app
COPY --chown=node:node --from=builder /app/out .

WORKDIR /app/apps/${SCOPE}

EXPOSE ${PORT}
CMD yarn start