const debug = require("debug")("concurrency-test");
const axios = require("axios");
const async = require("async");

const CONCURRENCY = 20;

const TEST_URL = "https://api.bte.ncats.io";
// const TEST_URL = "http://localhost:3000"
const TEST_ENDPOINT = "/v1/asyncquery";

const IDS = [
  "MONDO:0016575",
  "MONDO:0016575",
  "MONDO:0005377",
  "MONDO:0007035",
  "MONDO:0001993",
  "MONDO:0005015",
  "MONDO:0019609",
  "MONDO:0004975",
  "HP:0002014",
];

const start = performance.now();

let results = Array(CONCURRENCY).fill(0);

console.log(`Beginning test of ${CONCURRENCY} simultanoues queries...`);

results = async
  .map(results, async () => {
    return new Promise(async resolve => {
      // jitter sendout time by a few ms
      await new Promise((resolve) => setTimeout(() => resolve(), Math.floor(Math.random() * 10)));
      const start = performance.now();
      const id = IDS[Math.floor(Math.random() * IDS.length)]
      const body = {
        message: {
          query_graph: {
            edges: {
              e0: {
                subject: "n0",
                predicates: ["biolink:treats"],
                object: "n1",
                knowledge_type: "inferred",
              },
            },
            nodes: {
              n0: {
                categories: ["biolink:SmallMolecule"],
              },
              n1: {
                ids: [id],
                categories: ["biolink:Disease"],
              },
            },
          },
        },
      };

      setTimeout(() => resolve(`${id}: Timed out.`), 300000);
      let isAccepted = false;

      try {
        isAccepted = await axios({
          method: "post",
          url: `${TEST_URL}${TEST_ENDPOINT}`,
          headers: {
            "Content-type": "Application/json",
          },
          data: JSON.stringify(body),
          timeout: 300000,
        });
      } catch (error) {
        resolve(`${id}: Query error.`);
        return;
      }

      if (!isAccepted) {
        resolve(`${id}: Query not accepted.`);
        return;
      }

      const poll_url = isAccepted.data.job_url;

      let response;

      while (true) {
        try {
          response = await axios({
            method: "get",
            url: poll_url,
            timeout: 300000,
          });
          if (response.data.status === "Completed") {
            const end = performance.now();
            resolve(`${id}: Finished in ${Math.ceil((end - start) / 1000)}s`);
            return;
            break;
          } else if (response.data.status === "Failed") {
            resolve(`${id}: Query failed.`);
            return;
            break;
          }
        } catch (error) {
          console.log(error);
        }
        await new Promise(stopWaiting => setTimeout(() => stopWaiting(), 1000));
      }
    });
  })
  .then(value => {
    let failed = 0;
    value.forEach(result => {
      console.log(result);
      if (!result.includes("Finished") || result.includes("300s")) {
        failed += 1;
      }
    });
    end = performance.now();
    console.log(`\nTest completed in ${Math.ceil((end - start) / 1000)}s`);
    console.log(`Score: ${Math.round((CONCURRENCY - failed) / CONCURRENCY * 100)}%`)
    console.log(`Test ${!failed ? "passed!" : "failed."}`);
    process.exit();
  });
