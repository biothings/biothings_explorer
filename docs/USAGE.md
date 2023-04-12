# Usage

Once you have a local installation working, you can use your local instance by querying its various endpoints on `localhost:3000`.

## The Front Page

If this is your first time using BTE and TRAPI, you might wish to familiarize yourself with the querying format first. BTE provides a front page to get you started, which can be found at [`http://localhost:3000`](http://localhost:3000).

You'll be able to run some example queries that might give you an idea of the TRAPI standard.

## Synchronous Querying

The simplest way BTE works is by accepting queries to its synchronous endpoint. You can POST a query to `http://localhost:3000/v1/query` and the response will contain the results.

### Testing on a specific SmartAPI API

By default, BTE queries all APIs specified in the the [config.js file](https://github.com/biothings/biothings_explorer/blob/main/src/routes/v1/config.js). In some cases, you may want to override that default to specifically query a single API. For example, the SmartAPI ID for the EBI Proteins API is [`43af91b3d7cae43591083bff9d75c6dd`](https://smart-api.info/registry?q=43af91b3d7cae43591083bff9d75c6dd). To instruct BTE to query that API only, you can POST your query to `http://localhost:3000/v1/smartapi/43af91b3d7cae43591083bff9d75c6dd/query`. The general format is `http://localhost:3000/v1/smartapi/{smartapi_id}/query`.

## Asynchronous queries

You can also use BTE's asynchronous query endpoint, which features both web callback and polling support.

POST to `http://localhost:3000/asyncquery`. This endpoint behaves similarly to the `http://localhost:3000/query` endpoint with the same query graph as the input, however it responds with a link.

#### Key differences in an async query

- Instead of waiting for the query to complete a job _id_ is returned which you can then use to check the query status.
- If an additional _callback_ parameter is provided, we will send the query result to this callback URL via POST (optional).

The returned response looks like this:

```
{
  "id": "<id>",
  "url": "http://localhost:3000/v1/check_query_status/<id>"
}
```

#### You can then retrieve query results in two ways:

1. **Checking the query status**

    You can perform a GET request to the `http://localhost:3000/check_async_query/<id>` to check the query status. When the query is finished, the example response will look like this (query result is returned in `returnvalue` field):

    ```
    {
      'id': '<id>',
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
     'id': '<id>',
     'state': 'completed',
     'returnvalue': {
       'response': { ... },
       'status': 200
       'callback': 'Data sent to callback_url'
     },
     'progress': 0
   }
   ```

## Tracking queries

BTE exposes a dashboard to track the status of both synchronous and asynchronous queries. You can access it at [`http://localhost:3000/queues`](http://localhost:3000/queues).

## Testing with Alternate SmartAPI Specs (local or hosted)

### Using API Overrides

You may configure a set of API IDs to override from local files or URLs.

If the environment variable `API_OVERRIDE=true` is set (see example below), then [src/config/smartapi_overrides.json](../src/config/smartapi_overrides.json) is checked at server start and overrides are applied, as well as during subsequent `smartapi_specs.json` updates. Note that syncing must be enabled (`SMARTAPI_SYNC=true`) in order for `API_OVERRIDE` to take effect while BTE is running.

Starting BTE with API Overrides and automatic syncing enabled:

```bash
SMARTAPI_SYNC=true API_OVERRIDE=true npm run start
```

Alternatively, you may choose to only get `smartapi_specs.json` and apply overrides once, removing the requirement of enabling `SMARTAPI_SYNC` while running the server:

```bash
API_OVERRIDE=true npm run smartapi_sync
```

Override files may be specified as a URL which returns the expected yaml file or a `file:///` URI or arbitrary filepath, either of which must contain the absolute path to your override file. Override files are expected to be in yaml format. If overrides are specified with IDs not in the current SmartAPI spec, they will be appended as new API hits with a log warning.

You may also set `only_overrides` to `true` in the config to remove all other APIs and keep only the specified overrides.

### Example

Replace the latest [MyGene.info API](http://smart-api.info/registry?q=59dce17363dce279d389100834e43648) with a specific revision, and the [MyChem.info API](http://smart-api.info/registry?q=8f08d1446e0bb9c2b323713ce83e2bd3) with a local test version:

```json
{
  "conf": {
    "only_overrides": false
  },
  "apis": {
    "59dce17363dce279d389100834e43648": "https://raw.githubusercontent.com/NCATS-Tangerine/translator-api-registry/8b36f46d59c82d19b5cba40421a6ca9c2ed62e6b/mygene.info/openapi_full.yml",
    "8f08d1446e0bb9c2b323713ce83e2bd3": "file:///absolute/path/to/file/mychem_test.yaml"
  }
}
```

### API Overrides with Docker container

You may wish to use a container to test your custom API/annotations. After making changes to your override list (example above) you will need to rebuild the container:

```bash
docker build --rm --force-rm --compress -t biothings/bte-trapi .
```

To run the container with overrides and debug logging enabled:

```bash
docker run -it --rm -p 3000:3000 --name bte-trapi -e DEBUG="biomedical-id-resolver,bte*" -e API_OVERRIDE=true biothings/bte-trapi
```
