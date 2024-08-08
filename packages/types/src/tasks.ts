import { MessagePort } from "worker_threads";
import { APIList } from "./misc";
import {
  TrapiQueryGraph,
  TrapiResponse,
  TrapiSchema,
  TrapiWorkflow,
} from "./trapi";
import {
  SmartAPIKGOperationObject,
  SmartAPIQueryResult,
} from "@biothings-explorer/smartapi-kg";

// Options as they are assembled from the route
export interface QueryOptions {
  logLevel?: string;
  submitter?: string;
  smartAPIID?: string;
  teamName?: string;
  dryrun?: boolean;
  caching?: boolean; // from request url query values
}

// Options as they are passed to the Query Handler
export interface QueryHandlerOptions extends QueryOptions {
  metakg?: SmartAPIKGOperationObject[]; // list of meta kg ops
  provenanceUsesServiceProvider?: boolean;
  enableIDResolution?: boolean;
  apiList?: APIList;
  schema?: TrapiSchema; // might be hard to type -- it's the entire TRAPI schema IIRC
  resolveOutputIDs?: boolean;
  EDGE_ATTRIBUTES_USED_IN_RECORD_HASH?: string[];
  smartapi?: SmartAPIQueryResult;
}

export interface QueueData {
  queryGraph: TrapiQueryGraph;
  options: QueryOptions;
  workflow?: TrapiWorkflow[];
  callback_url?: string;
  smartAPIID?: string;
  teamName?: string;
  route: string;
}

export interface TaskQueryParams {
  id?: string; // Job ID
}

export interface TaskData extends QueueData {
  route: string;
  params?: TaskQueryParams;
  endpoint?: string;
  abortController?: AbortController;
  url?: string;
  enableIDResolution?: boolean;
}

// Info provided to outer task function (defined alongside route)
export interface TaskInfo {
  id?: string;
  data: TaskData;
}

// Info provided to task handler (inside thread)
export interface InnerTaskData {
  req: TaskInfo;
  route: string;
  traceparent?: string;
  tracestate?: string;
  port: MessagePort;
  job?: {
    jobId: string | number;
    queueName: string;
  };
}

// Data sent to/from worker threads
export interface ThreadMessage {
  threadId: string | number;
  type: string;
  value?: unknown;
  status?: number;
}
