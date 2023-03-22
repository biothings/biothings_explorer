# Usage

Once you have a local installation working, you can use your local instance by querying its various endpoints on `localhost:3000`.

## Testing on a specific SmartAPI API

By default, BTE queries all APIs specified in the the[ config.js file](https://github.com/biothings/BioThings_Explorer_TRAPI/blob/main/src/routes/v1/config.js). In some cases, you may want to override that default to specifically query a single API. For example, the SmartAPI record for the "EBI Proteins API) is [43af91b3d7cae43591083bff9d75c6dd](https://smart-api.info/registry?q=43af91b3d7cae43591083bff9d75c6dd). To instruct BTE to query that API only, you can POST your query to http://localhost:3000/v1/smartapi/43af91b3d7cae43591083bff9d75c6dd/query

## Asynchronous queries

You can also use our asynchronous query with both web callback and polling support.

To sumbit an async query:

POST on `http://localhost:3000/asyncquery`. This endpoint behaves similarly to the `http://localhost:3000/query` endpoint with the same query graph as the input.

```
POST  {{base_url}}/v1/asyncquery
Content-Type: application/json

{
    "message": {
        "query_graph": {
            "edges": {
                "e0": {
                    "subject": "n0",
                    "object": "n1",
                    "predicates": [
                        "biolink:decreases_abundance_of",
                        "biolink:decreases_activity_of",
                        "biolink:decreases_expression_of"
                    ]
                }
            },
            "nodes": {
                "n0": {
                    "categories": ["biolink:SmallMolecule"],
                    "name": "some chemical"
                },
                "n1": {
                    "name": "EGFR",
                    "ids": ["NCBIGene:1956"]
                }
            }
        }
    }
}

```

**Key differences in an async query**

- Instead of waiting for the query to complete a job _id_ is returned which you can then use to check the query status.
- If an additional _callback_ parameter is provided, we will send the query result to this callback URL via POST (optional).

The returned response looks like this:

```
{
  "id": "N96xbq25zP",
  "url": "http://localhost:3000/v1/check_query_status/N96xbq25zP"
}
```

**You can then retrieve query results in two ways:**

1. **Checking the query status**

   You can perform a GET request to the `http://localhost:3000/check_async_query/<id>` to check the query status. When the query is finished, the example response will look like this (query result is returned in `returnvalue` field):

   ```
   {
     'id': 'N96xbq25zP',
     'state': 'completed',
     'returnvalue': {
       'response': { ... },
       'status': 200
     },
     'progress': 0
   }
   ```

2. **Return result via a callback URL**

   When a callback URL is provided in the input sent to `/v1/asyncquery`, like this:

   ```
   {
     "callback": "https://example.com/handle_query_result",
     "message": {
         "query_graph": {
                ...
             }
         }
     }
   }
   ```

   Once the query is executed, its query result will be sent to this callback URL via POST. The status can also be checked via `/check_async_query/<id>` endpoint:

   ```
   {
     'id': 'N96xbq25zP',
     'state': 'completed',
     'returnvalue': {
       'response': { ... },
       'status': 200
       'callback': 'Data sent to callback_url'
     },
     'progress': 0
   }
   ```

## Environment Variables

Several environment variables are supported for various purposes, listed below:

- `NODE_ENV` When set as `NODE_ENV=production`, the package runs in production mode, including synchronizing the latest SmartAPI specifications on a schedule.
- `PORT` Sets the port the server will listen on. Defaults to `3000`.
- `SMARTAPI_SYNC=true|false` May be set to override all SmartAPI syncing behavior.
- `API_OVERRIDE=true|false` May be set to set overrides for specific APIs (see [Using `API_OVERRIDE=true`](#using-api_overridetrue))
- `RESULT_CACHING=true|false` May be set to enable or disable the use of caching for query result edges. Requires `REDIS_HOST` and `REDIS_PORT` to be enabled.
- `REDIS_HOST` The hostname of the Redis server to be used for caching.
- `REDIS_PORT` The port of the Redis server to be used for caching.
- `REDIS_PASSWORD` The password for the Redis server, if applicable.
- `REDIS_TLS_ENABLED` Enables TLS mode for the Redis client.
- `REDIS_KEY_EXPIRE_TIME` Sets the time to keep cached results in seconds. Defaults to 10 minutes.
- `JOB_TIMEOUT` Sets a timeout on asynchronous jobs in ms. No default.
- `ASYNC_COMPLETED_EXPIRE_TIME` Sets the amount of time to keep an asynchronous job result, after which the results expire and are deleted to make space for new job results. Expressed in seconds. Defaults to 7 days.
- `DEBUG` May be set to capture different package debug logs by match to comma-separated strings.
- `SETIMMEDIATE_TIME` Override the timing used on several calls to `setImmediatePromise()` used for performance reasons. Shouldn't be overridden except for performance testing purposes. Expressed in ms.
- `MAX_QUERIES_PER_MIN` Sets the maximum number of queries allowable from a client in a 1-minute window. Defaults to 15.
- `STATIC_PATH` Overrides the path to the folder containing `./data/smartapi_specs.json` and `./data/predicates.json`.
- `REQUEST_TIMEOUT` Sets a timeout for non-synchronous threaded requests in seconds. No default, however the monorepo pm2 configuration defaults to 20 minutes.
- `USE_THREADING` Disables threading (threaded requests fall back to non-threaded execution) when set to `false`. Threading is enabled by default.
- `BIOLINK_FILE` Overrides path to biolink file.
