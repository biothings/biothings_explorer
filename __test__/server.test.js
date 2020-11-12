const app = require("../src/app");
const request = require('supertest');

describe("Testing endpoints", () => {
    const query = {
        "message": {
            "query_graph": {
                "edges": [
                    {
                        "id": "e10",
                        "source_id": "n0",
                        "target_id": "n1"
                    }
                ],
                "nodes": [
                    {
                        "id": "n0",
                        "type": "gene",
                        "curie": "NCBIGene:1017"
                    },
                    {
                        "id": "n1",
                        "type": "chemical_substance"
                    }
                ]
            }
        }
    }
    test("GET /", async () => {
        await request(app)
            .get("/")
            .expect(302)
    })

    test("GET /performance", async () => {
        await request(app)
            .get("/performance")
            .expect(200)
    })

    test("GET /predicates", async () => {
        await request(app)
            .get("/predicates")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("gene");
            })
    })

    test("GET /metakg", async () => {
        await request(app)
            .get("/metakg")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body[0]).toHaveProperty("subject");
            })
    })

    test("POST /query", async () => {
        await request(app)
            .post("/query")
            .send(query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("query_graph");
                expect(response.body).toHaveProperty("knowledge_graph");
                expect(response.body.knowledge_graph.edges[0].source_id).toEqual("NCBIGene:1017");
            })
    })

    test("POST /smartapi/query", async () => {
        await request(app)
            .post("/smartapi/8f08d1446e0bb9c2b323713ce83e2bd3/query")
            .send(query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("query_graph");
                expect(response.body).toHaveProperty("knowledge_graph");
                expect(response.body.knowledge_graph.edges[0].api).toEqual("MyChem.info API");
            })
    })

    test("POST /source/query", async () => {
        await request(app)
            .post("/source/drugbank/query")
            .send(query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("query_graph");
                expect(response.body).toHaveProperty("knowledge_graph");
                expect(response.body.knowledge_graph.edges[0].provided_by).toEqual("drugbank");
            })
    })

})