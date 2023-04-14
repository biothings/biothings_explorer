#!/bin/bash

current_folder=`pwd`
redis_available=false

npm run compile
if [ "$1" = "redis" ]
then
    {
        redis-cli -h localhost -p 6379 ping > /dev/null 2>&1
    } && {
        redis-cli flushall  > /dev/null 2>&1 && echo 'Flushed redis store.' && redis_available=true
    } || {
        [ "$(docker ps -a | grep test-redis)" ] && echo 'Killed existing redis container.'
        docker rm test-redis --force > /dev/null 2>&1
        docker run --name test-redis -p 6379:6379 -d --hostname=redis:latest redis redis-server && echo 'Containerized redis started.' && redis_available=true
    } || {
        echo 'Docker not available, starting redis-server...'
        redis-server --daemonize yes && redis_available=true
    } || {
        echo 'Neither docker nor native redis available, starting server without redis...'
        redis_available=false
    }
    if [ "$redis_available" ] ;
    then
        REDIS_HOST=localhost REDIS_PORT=6379 npm run debug
    else
        npm run debug
    fi
else
    npm run debug
fi

cd $current_folder
