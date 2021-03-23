const app = require("../../../src/app");
const request = require('supertest');
const fs = require("fs");
const axios = require("axios");
var path = require('path');

describe("Testing /v1/smartapi/{smartapi_id}/query endpoints", () => {
    const invalid_example_folder = path.resolve(__dirname, "../../../examples/v1/invalid");
    const example_foler = path.resolve(__dirname, '../../../examples/v1');
    test("Input query graph that doesn't pass Swagger Validation should return 400 error", async () => {
        const InvalidInputQueryGraph = {
            message1: 1
        };
        await request(app)
            .post("/v1/smartapi/5be0f321a829792e934545998b9c6afe/query/")
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
            .post("/v1/smartapi/5be0f321a829792e934545998b9c6afe/query/")
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
            .post("/v1/smartapi/5be0f321a829792e934545998b9c6afe/query/")
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
            .post("/v1/smartapi/5be0f321a829792e934545998b9c6afe/query/")
            .send(query_with_nodes_and_edges_not_match)
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("error", "Your input query graph is invalid");
            })
    })

    test("Query to Text Mining Targeted Association KP should have id resolution turned off", async () => {
        const query = JSON.parse(fs.readFileSync(path.join(example_foler, "textmining/query_chemicals_related_to_gene_or_gene_product.json")));
        await request(app)
            .post("/v1/smartapi/978fe380a147a8641caf72320862697b/query/")
            .send(query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("CHEBI:32677")
                expect(response.body.message.knowledge_graph.nodes["CHEBI:32677"].attributes[0].value).toEqual(["CHEBI:32677"])
            })
    })

    test("Query to Text Mining Targeted Association KP should have id resolution turned off", async () => {
        const query = JSON.parse(fs.readFileSync(path.join(example_foler, "textmining/query_chemicals_related_to_gene_or_gene_product.json")));
        await request(app)
            .post("/v1/smartapi/978fe380a147a8641caf72320862697b/query/")
            .send(query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("CHEBI:32677")
                expect(response.body.message.knowledge_graph.nodes["CHEBI:32677"].attributes[0].value).toEqual(["CHEBI:32677"])
            })
    })

    test("Query to non-Text Mining KPs should have id resolution turned on", async () => {
        const query = JSON.parse(fs.readFileSync(path.join(example_foler, "serviceprovider/mychem.json")));
        await request(app)
            .post("/v1/smartapi/8f08d1446e0bb9c2b323713ce83e2bd3/query")
            .send(query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("NCBIGENE:6530")
            })
    })

    test("Query to Text Mining Co-occurrence KP should be correctly paginated", async () => {
        const query = JSON.parse(fs.readFileSync(path.join(example_foler, "textmining/query_chemicals_related_to_disease.json")));
        const apiResponse = await axios.get('https://biothings.ncats.io/text_mining_co_occurrence_kp/query?q=object.id:%22MONDO:0005252%22%20AND%20subject.type:%22ChemicalSubstance%22');
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