# Reference

Basic reference information about BTE behaviors can be found below.

## Environment Variables

Several environment variables are supported for various purposes, listed below:


#### `NODE_ENV`
**Default:** `development`

**Docker Default:** `production`

**Description:** When set to `production`, the package runs in production mode, including synchronizing the latest SmartAPI specifications on a schedule. When set to `development`, additional traceback information is retained in TRAPI logs.

#### `INSTANCE_ENV`
**Default:** `prod`

**Docker Default:** `prod`

**Description:** Controls which maturity-level servers BTE should query for each API.

#### `PORT`
**Default:** `3000`

**Docker Default:** `3000`

**Description:**` The port that BTE will listen on.

#### `SMARTAPI_SYNC`
**Default:** `false`

**Docker Default:** `true`

**Description:** Overrides all SmartAPI syncing behavior, regardless of `NODE_ENV`. See [Syncing SmartAPI Specifications](./INSTALLATION.md#syncing-smartapi-specifications).

#### `API_OVERRIDE`
**Default:** `false`

**Docker Default:** `false`

**Description:** Use configured API overrides. See [Using API Overrides.](./USAGE.md#using-api-overrides)

#### `RESULT_CACHING`
**Default:** `true`

**Docker Default:** `true`

**Description:** enable or disable the use of caching for query result edges. Requires a Redis instance and `REDIS_HOST` and `REDIS_PORT` to be enabled. See [Running BTE through Docker](./INSTALLATION.md#running-manually) or [Running the project with Redis](./INSTALLATION.md#running-the-project-with-redis) if you're using the workspace.

#### `REDIS_HOST`
**Default:** `localhost`

**Docker Default:** `localhost`

**Description:** The hostname of the Redis server BTE will be using. Required for BTE to run with Redis. See [Running BTE through Docker](./INSTALLATION.md#running-manually) or [Running the project with Redis](./INSTALLATION.md#running-the-project-with-redis) if you're using the workspace.

#### `REDIS_PORT`
**Default:** `6379`

**Docker Default:** `6379`

**Description:** The port of the Redis server BTE will be using. Required for BTE to run with Redis. See [Running BTE through Docker](./INSTALLATION.md#running-manually) or [Running the project with Redis](./INSTALLATION.md#running-the-project-with-redis) if you're using the workspace.

#### `REDIS_PASSWORD`
**Default:** `undefined`

**Docker Default:** `undefined`

**Description:** Password used with Redis.

#### `REDIS_TLS_ENABLED`
**Default:** `false`

**Docker Default:** `false`

**Description:** Set if the Redis instance BTE is connecting to uses TLS.

#### `REDIS_CLUSTER`
**Default:** `false`

**Docker Default:** `false`

**Description:** Set to `true` if Redis server is in cluster mode.

#### `REDIS_KEY_EXPIRE_TIME`
**Default:** `1800`

**Docker Default:** `1800`

**Description:** Number of seconds after which cached edges should expire. Default comes to 30 minutes.

#### `JOB_TIMEOUT`
**Default:** `7200000`

**Docker Default:** `7200000`

**Description:** Number of ms after which an asynchronous query should fail after execution start. Default comes to 2 hours.

#### `ASYNC_COMPLETED_EXPIRE_TIME`
**Default:** `2592000`

**Docker Default:** `2592000`

**Description:** Number of seconds after which an asynchronous result should expire. Default comes to 30 days.

#### `DEBUG`
**Default:** `undefined`

**Docker Default:** `undefined`

**Description:** Defines prefixes for debug log types to log. Usually, for debugging, set to `biomedical-id-resolver,bte*`.

#### `MAX_QUERIES_PER_MIN`
**Default:** `15`

**Docker Default:** `15`

**Description:** Maximum number of queries allowable from a single client in a 1-minute window, after which they will receive HTTP 429 until they are again allowed by the rate limit.

#### `STATIC_PATH`
**Default:** `undefined`

**Docker Default:** `undefined`

**Description:** Overrides the path to the folder containing `./data/smartapi_specs.json` and `./data/predicates.json`.

#### `REQUEST_TIMEOUT`
**Default:** `undefined`

**Docker Default:** `600`

**Description:** Time in seconds after which any threaded, non-asynchronous request will timeout and be terminated.

#### `USE_THREADING`
**Default:** `true`

**Docker Default:** `true`

**Description:** Run all TRAPI requests in queued thread pools.

#### `BIOLINK_FILE`
**Default:** `undefined`

**Docker Default:** `undefined`

**Description:** Overrides path to biolink file.

#### `MAX_RECORDS_PER_EDGE`
**Default:** `30000`

**Docker Default:** `30000`

**Description:** Maximum number of records allowable on a single query edge, after which query execution will be forced to move on to the next edge (or complete if there are no other edges).

#### `MAX_RECORDS_TOTAL`
**Default:** `60000`

**Docker Default:** `60000`

**Description:** Maximum number of records allowable in a single query execution, after which the query will be terminated.

#### `SLACK_CHANNEL`
**Default:** `undefined`

**Docker Default:** `undefined`

**Description:** Slack channel to alert if BTE encounters a max_records event.

#### `SLACK_OAUTH`
**Default:** `undefined`

**Docker Default:** `undefined`

**Description:** OAuth required to alert a Slack bot to send messages in BTE encounters a max_records event.

#### `DRYRUN`
**Default:** `false`

**Docker Default:** `false`

**Description:** Run query execution as normal, but do not actually query APIs.
