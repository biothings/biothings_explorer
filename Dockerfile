# Build (remove --squash if docker does not support it):
# docker build --rm --force-rm --compress --squash -t biothings/bte-trapi .
# Run:
# docker run -it --rm -p 3000:3000 --name bte-trapi biothings/bte-trapi
# Run with DEBUG logs enabled:
# docker run -it --rm -p 3000:3000 --name bte-trapi -e DEBUG="biomedical-id-resolver,bte*" biothings/bte-trapi
# Run with redis-server running on host:
# docker run -it --rm -p 3000:3000 --name bte-trapi  -e REDIS_HOST=host.docker.internal -e REDIS_PORT=6379 -e DEBUG="biomedical-id-resolver,bte*" biothings/bte-trapi
# Log into container:
# docker exec -ti bte-trapi sh
FROM node:18-alpine
ARG debug
RUN apk add --no-cache bash
SHELL ["/bin/bash", "-c"]
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
RUN npm i pm2 -g
RUN npm i pnpm -g
# Install required dependecies in a "build-deps" virtual package,
# which can be easily cleaned up after build completes
# Add additional dependencies in the same line if needed
#    git: used for clone multiple source repos in our monorepo setup
#    lz4 python3 make g++: required to build lz4 nodejs package
RUN apk add --no-cache --virtual build-deps git lz4 python3 make g++ py3-setuptools
RUN apk add --no-cache curl
COPY --chown=node:node . .
USER node

RUN export GIT_REMOTE_PROTOCOL=https \
    && pnpm run setup \
    && pnpm run --silent get_rev > .current_rev 
    # && pnpm run clean_on_prod \
    # && (pnpm i --production || true)
USER root
# clean up dependecies from the "build-deps" virtual package
RUN apk del build-deps
USER node
RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:max_size 1G
EXPOSE 3000
ENV NODE_ENV production
ENV DEBUG ${debug:+biomedical-id-resolver,bte*}
ENV API_OVERRIDE true
# ENV USE_THREADING ${debug:+false}
CMD ["pm2-runtime", "bte-pm2.json", "--env prodci", "--only", "bte-trapi"]
