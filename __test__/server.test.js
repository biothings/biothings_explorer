const app = require("../src/app");
const request = require('supertest');
const fs = require("fs");
var path = require('path');


describe("Testing endpoints", () => {
    const example_foler = path.resolve(__dirname, '../examples/v0.9.2');
    const gene2chemical_query = JSON.parse(fs.readFileSync(path.join(example_foler, 'query_chemicals_physically_interacts_with_genes.json')));
    const disease2gene_query = JSON.parse(fs.readFileSync(path.join(example_foler, 'query_genes_relate_to_disease.json')));
    const multihop_query = JSON.parse(fs.readFileSync(path.join(example_foler, 'multi_hop_query.json')));

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

    test("GET /metakg with provided_by specified", async () => {
        await request(app)
            .get("/metakg?provided_by=drugbank")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body[0]).toHaveProperty("subject");
                expect(response.body[0]).toHaveProperty("provided_by", "drugbank")
            })
    })

    test("GET /metakg with provided_by specified with quotation marks added", async () => {
        await request(app)
            .get('/metakg?provided_by="drugbank"')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body[0]).toHaveProperty("subject");
                expect(response.body[0]).toHaveProperty("provided_by", "drugbank")
            })
    })

    test("GET /metakg with api specified", async () => {
        await request(app)
            .get("/metakg?api=MyChem.info API")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body[0]).toHaveProperty("subject");
                expect(response.body[0].api).toHaveProperty("name", "MyChem.info API")
            })
    })

    test("GET /metakg with api specified and quotation mark added", async () => {
        await request(app)
            .get('/metakg?api="MyChem.info API"')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body[0]).toHaveProperty("subject");
                expect(response.body[0].api).toHaveProperty("name", "MyChem.info API")
            })
    })

    test("POST /query with gene2chemical query", async () => {
        await request(app)
            .post("/query")
            .send(gene2chemical_query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("query_graph");
                expect(response.body).toHaveProperty("knowledge_graph");
                expect(response.body.knowledge_graph.edges[0].source_id).toEqual("NCBIGene:1017");
            })
    })

    test("POST /query with disease2gene query", async () => {
        await request(app)
            .post("/query")
            .send(disease2gene_query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("query_graph");
                expect(response.body).toHaveProperty("knowledge_graph");
                expect(response.body.knowledge_graph.edges[0].source_id).toEqual("MONDO:0016575");
            })
    })

    test("POST /query with multihop query", async () => {
        await request(app)
            .post("/query")
            .send(multihop_query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("query_graph");
                expect(response.body).toHaveProperty("knowledge_graph");
                expect(response.body.knowledge_graph.edges[0].source_id).toEqual("MONDO:0016575");
            })
    })

    test("POST /smartapi/query", async () => {
        await request(app)
            .post("/smartapi/8f08d1446e0bb9c2b323713ce83e2bd3/query")
            .send(gene2chemical_query)
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
            .send(gene2chemical_query)
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