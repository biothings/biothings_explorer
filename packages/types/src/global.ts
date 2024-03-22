// Cursed globals that exist for Reasons

import { TrapiQueryGraph } from "./trapi";
import { SmartAPISpec } from "@biothings-explorer/smartapi-kg";
import { Queue } from "bull";
import Piscina from "piscina";

export interface QueryQueue {
  bte_sync_query_queue: Queue;
  bte_query_queue: Queue;
  bte_query_queue_by_api: Queue;
  bte_query_queue_by_team: Queue;
}

export interface QueryInformation {
  queryGraph: TrapiQueryGraph;
  isCreativeMode?: boolean;
  creativeTemplate?: string;
  totalRecords?: number;
  jobID?: string;
  callback_url?: string;
}

export interface ThreadPool {
  sync: Piscina;
  async: Piscina;
  misc: Piscina;
}

/* eslint no-var: off */
declare global {
  var missingAPIs: SmartAPISpec[];
  var BIOLINK_VERSION: string;
  var SCHEMA_VERSION: string;
  var parentPort: MessagePort;
  var cachingTasks: Promise<void>[];
  var queryInformation: QueryInformation;
  var job: {
    log: (logString: string) => void;
  }; // TODO type as Piscina job
  var queryQueue: QueryQueue;
  var threadpool: ThreadPool;
}

export { };
