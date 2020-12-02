const app = require("../../src/app");
const request = require('supertest');
const fs = require("fs");
var path = require('path');


describe("Testing endpoints", () => {
    const example_foler = path.resolve(__dirname, '../../examples/v1');
    const invalid_folder = path.resolve(__dirname, "../../examples");
    const gene2chemical_query = JSON.parse(fs.readFileSync(path.join(example_foler, 'query_chemicals_physically_interacts_with_genes.json')));
    const disease2gene_query = JSON.parse(fs.readFileSync(path.join(example_foler, 'query_genes_relate_to_disease.json')));
    const invalid_query = JSON.parse(fs.readFileSync(path.join(invalid_folder, 'query_genes_relate_to_disease.json')));

    test("POST /v1/query with gene2chemical query", async () => {
        await request(app)
            .post("/v1/query")
            .send(gene2chemical_query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toHaveProperty("query_graph");
                expect(response.body.message).toHaveProperty("knowledge_graph");
                expect(response.body.message.knowledge_graph).toHaveProperty("nodes");
                expect(response.body.message.knowledge_graph).toHaveProperty("edges");
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("NCBIGene:1017")
            })
    })

    test("POST /v1/query with invalid query graph", async () => {
        await request(app)
            .post("/v1/query")
            .send(invalid_query)
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("error", "Your input query graph is invalid");
            })
    })

    test("POST /v1/query with disease2gene query", async () => {
        await request(app)
            .post("/v1/query")
            .send(disease2gene_query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toHaveProperty("query_graph");
                expect(response.body.message).toHaveProperty("knowledge_graph");
                expect(response.body.message.knowledge_graph).toHaveProperty("nodes");
                expect(response.body.message.knowledge_graph).toHaveProperty("edges");
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("MONDO:0005737");
            })
    })

})