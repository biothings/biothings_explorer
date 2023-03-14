const app = require("../../../src/app");
const request = require('supertest');
const fs = require("fs");
const axios = require("axios");
var path = require('path');

//API IDs used in the tests
const myChemAPI = "8f08d1446e0bb9c2b323713ce83e2bd3"
const textMiningAPI = "978fe380a147a8641caf72320862697b"

// if needed
const og_axios = jest.requireActual("axios")

jest.mock('axios')

describe("Testing /v1/smartapi/{smartapi_id}/query endpoints", () => {
    const invalid_example_folder = path.resolve(__dirname, "../../../examples/v1.1/invalid");
    const example_folder = path.resolve(__dirname, '../../../examples/v1.1');
    test("Input query graph that doesn't pass Swagger Validation should return 400 error", async () => {
        const InvalidInputQueryGraph = {
            message1: 1
        };
        await request(app)
            .post(`/v1/smartapi/${myChemAPI}/query/`)
            .send(InvalidInputQueryGraph)
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("error", "Your input query graph is invalid");
            })
    })

    test("Input query graph missing nodes definition should return 400", async () => {
        const query_with_nodes_undefined = JSON.parse(fs.readFileSync(path.join(invalid_example_folder, "query_graph_with_nodes_not_specified.json")));
        await request(app)
            .post(`/v1/smartapi/${myChemAPI}/query/`)
            .send(query_with_nodes_undefined)
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("error", "Your input query graph is invalid");
            })
    })

    test("Input query graph missing edges definition should return 400 error", async () => {
        const query_with_edges_undefined = JSON.parse(fs.readFileSync(path.join(invalid_example_folder, "query_graph_with_edges_not_specified.json")));
        await request(app)
            .post(`/v1/smartapi/${myChemAPI}/query/`)
            .send(query_with_edges_undefined)
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("error", "Your input query graph is invalid");
            })
    })

    test("Input query graph with nodes and edges mismatch should return 400 error", async () => {
        const query_with_nodes_and_edges_not_match = JSON.parse(fs.readFileSync(path.join(invalid_example_folder, "query_graph_with_nodes_and_edges_not_match.json")));
        await request(app)
            .post(`/v1/smartapi/${myChemAPI}/query/`)
            .send(query_with_nodes_and_edges_not_match)
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("error", "Your input query graph is invalid");
            })
    })
    // 2021-09-09: need to update the example query
    // also skipping because this API and its x-bte annotation will soon change.
    //   Once both are updated, can review this test and its desired behavior again...
    test.skip("Query to Text Mining Targeted Association KP should have id resolution turned off", async () => {
        const query = JSON.parse(fs.readFileSync(path.join(example_folder, "textmining/query_chemicals_related_to_gene_or_gene_product.json")));
        await request(app)
            .post(`/v1/smartapi/${textMiningAPI}/query/`)
            .send(query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("CHEBI:32677")
                expect(response.body.message.knowledge_graph.nodes["CHEBI:32677"].attributes[0].value).toEqual(["CHEBI:32677"])
            })
    })

    // 2023-03-14: id resolution has been disable on by-team and by-api endpoints for a while
    // so this test doesn't make a lot of sense anymor...
    test.skip("Query to non-Text Mining KPs should have id resolution turned on", async () => {
        const sri_path = path.resolve(__dirname, '../../data/api_results/chembl_sri.json');
        axios.default.post.mockResolvedValue({ data: JSON.parse(fs.readFileSync(sri_path)) })
        const mychem_path = path.resolve(__dirname, '../../data/api_results/mychem_query.json');
        axios.default.mockResolvedValue({ data: JSON.parse(fs.readFileSync(mychem_path)) })
        // axios.default.post.mockImplementation(async (...q) => {
        //   const res = await og_axios.default.post(...q)
        //   console.log(JSON.stringify(res.data))
        //   return res
        // })
        const query = JSON.parse(fs.readFileSync(path.join(example_folder, "serviceprovider/mychem.json")));
        await request(app)
            .post(`/v1/smartapi/${myChemAPI}/query`)
            .send(query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(Object.keys(response.body.message.knowledge_graph.nodes)).toContain("PUBCHEM.COMPOUND:5070")
            })
    })

    // Reason: TypeError: Cannot set property attributes of #<IrresolvableBioEntity> which has only a getter
    test.skip("Query to Text Mining Co-occurrence KP should be correctly paginated", async () => {
        const query = JSON.parse(fs.readFileSync(path.join(example_folder, "textmining/query_chemicals_related_to_disease.json")));
        const apiResponse = await axios.get('https://biothings.ncats.io/text_mining_co_occurrence_kp/query?q=object.id:%22MONDO:0005252%22%20AND%20subject.type:%22SmallMolecule%22');
        const hits = apiResponse.data.total;
        await request(app)
            .post("/v1/smartapi/5be0f321a829792e934545998b9c6afe/query/")
            .send(query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message.knowledge_graph.nodes["CHEBI:26404"].attributes[0].value).toEqual(["CHEBI:26404"])
                expect(Object.keys(response.body.message.knowledge_graph.nodes)).toHaveLength(hits + 1)
            })
    })
})
