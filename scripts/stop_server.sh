#!/bin/bash

btepid=$(pgrep -f bte-trapi)
echo "$btepid" | xargs -n1 pkill -9 -P && echo 'BTE subprocesses stopped.' || true
echo "$btepid" | xargs -n1 kill -s KILL && echo 'BTE Stopped.'
[ "$(docker ps -a | grep test-redis)" ] && docker rm test-redis --force > /dev/null 2>&1 && echo 'Containerized redis stopped.'
redis-cli flushall > /dev/null 2>&1 && redis-cli shutdown > /dev/null 2>&1 && echo 'Native redis stopped.'
