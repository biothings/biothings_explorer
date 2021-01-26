const app = require("../../src/app");
const request = require('supertest');
const fs = require("fs");
var path = require('path');


describe("Testing /team/{team_name}/query endpoints", () => {
    const targeted_association_foler = path.resolve(__dirname, '../../examples/v1/textmining/targeted_association_kp');
    const chemical2gene_query = JSON.parse(fs.readFileSync(path.join(targeted_association_foler, 'query_chemical_to_gene.json')));
    const clinical_risk_kp_foler = path.resolve(__dirname, '../../examples/v1/multiomics/clinical_risk_kp');
    const drugexposure2disease_query = JSON.parse(fs.readFileSync(path.join(clinical_risk_kp_foler, 'query_drug_exposure_to_disease.json')));


    test("POST /v1/team/{team_name}/query with text mining query example", async () => {
        await request(app)
            .post("/v1/team/Text Mining Provider/query")
            .send(chemical2gene_query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toHaveProperty("query_graph");
                expect(response.body.message).toHaveProperty("knowledge_graph");
                expect(response.body.message.knowledge_graph).toHaveProperty("nodes");
                expect(response.body.message.knowledge_graph).toHaveProperty("edges");
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("PR:000008790");
            })
    })
    test("POST /v1/team/{team_name}/query with multiomics query example", async () => {
        await request(app)
            .post("/v1/team/Multiomics Provider/query")
            .send(drugexposure2disease_query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toHaveProperty("query_graph");
                expect(response.body.message).toHaveProperty("knowledge_graph");
                expect(response.body.message.knowledge_graph).toHaveProperty("nodes");
                expect(response.body.message.knowledge_graph).toHaveProperty("edges");
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("MONDO:0005015");
            })
    })
})