const app = require("../../src/app");
const request = require('supertest');
const fs = require("fs");
var path = require('path');


describe("Testing v1.1 endpoints", () => {
    const example_folder = path.resolve(__dirname, '../../examples/v1.1');
    const clinical_risk_kp_folder = path.resolve(__dirname, '../../examples/v1.1/multiomics/clinical_risk_kp');
    const old_spec_folder = path.resolve(__dirname, "../../examples/v0.9.2");
    const invalid_example_folder = path.resolve(__dirname, "../../examples/v1.1/invalid");
    const drug2disease_query = JSON.parse(fs.readFileSync(path.join(clinical_risk_kp_folder, 'query_drug_to_disease.json')));
    const gene2chemical_query = JSON.parse(fs.readFileSync(path.join(example_folder, 'query_chemicals_physically_interacts_with_genes.json')));
    const disease2gene_query = JSON.parse(fs.readFileSync(path.join(example_folder, 'query_genes_relate_to_disease.json')));
    const query_using_earlier_trapi_spec = JSON.parse(fs.readFileSync(path.join(old_spec_folder, 'query_genes_relate_to_disease.json')));
    const query_without_category = JSON.parse(fs.readFileSync(path.join(example_folder, 'query_without_input_category.json')))
    const expand_node = JSON.parse(fs.readFileSync(path.join(example_folder, 'query_with_node_to_be_expanded.json')))

    test("GET /v1/meta_knowledge_graph", async () => {
        await request(app)
            .get("/v1/meta_knowledge_graph")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("nodes");
                expect(response.body).toHaveProperty("nodes.biolink:Gene");
                expect(response.body).toHaveProperty("nodes.biolink:Gene.id_prefixes");

                expect(response.body).toHaveProperty("edges");
                expect(response.body.edges).toEqual(
                    expect.arrayContaining([
                      expect.objectContaining({
                        "subject": "biolink:SmallMolecule",
                        "predicate": "biolink:entity_positively_regulates_entity",
                        "object": "biolink:Gene"
                      })
                    ])
                );
            })
    })

    test("GET /v1/team/{team_name}/meta_knowledge_graph", async () => {
        await request(app)
            .get("/v1/team/Service Provider/meta_knowledge_graph")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("nodes");
                expect(response.body).toHaveProperty("nodes.biolink:Gene");
                expect(response.body).toHaveProperty("nodes.biolink:Gene.id_prefixes");

                expect(response.body).toHaveProperty("edges");
                expect(response.body.edges).toEqual(
                    expect.arrayContaining([
                      expect.objectContaining({
                        "subject": "biolink:SequenceVariant",
                        "predicate": "biolink:is_sequence_variant_of",
                        "object": "biolink:Gene",
                      })
                    ])
                );
            })
    })

    test("Query to Text Mining team Should return 200 with valid response", async () => {
        await request(app)
            .get("/v1/team/Text Mining Provider/meta_knowledge_graph")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("nodes.biolink:Gene");
                expect(response.body.edges).toEqual(
                    expect.arrayContaining([
                      expect.objectContaining({
                        "subject": "biolink:SmallMolecule",
                        "predicate": "biolink:treats",
                        "object": "biolink:Disease",
                      })
                    ])
                );
            })
    })

    test("Query to Invalid team Should return 200 with empty response", async () => {
        await request(app)
            .get("/v1/team/wrong team/meta_knowledge_graph")
            .expect(404)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toEqual({
                    "error": "Unable to load predicates",
                    "more_info": "Failed to Load MetaKG: PredicatesLoadingError: Not Found - 0 operations",
                });
            })
    })

    test("GET /v1/smartapi/{smartapi_id}/meta_knowledge_graph", async () => {
        await request(app)
            // testing with "Text Mining Targeted Association API"
            .get("/v1/smartapi/978fe380a147a8641caf72320862697b/meta_knowledge_graph")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("nodes.biolink:Disease");
                expect(response.body.edges).toEqual(
                    expect.arrayContaining([
                      expect.objectContaining({
                        "subject": "biolink:SmallMolecule",
                        "predicate": "biolink:treats",
                        "object": "biolink:Disease"
                      })
                    ])
                );
            })
    })

    test("Query to Invalid API Should return 404 with error message included", async () => {
        await request(app)
            .get("/v1/smartapi/78fe380a147a8641caf72320862697b/meta_knowledge_graph")
            .expect(404)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("error", "Unable to load predicates");
                expect(response.body).toHaveProperty("more_info", "Failed to Load MetaKG: PredicatesLoadingError: Not Found - 0 operations");
            })
    })

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

    //Skip this test for now, need to check the actual API data
    test.skip("POST /v1/query with clinical risk kp query", async () => {
        await request(app)
            .post("/v1/query")
            .send(drug2disease_query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toHaveProperty("query_graph");
                expect(response.body.message).toHaveProperty("knowledge_graph");
                expect(response.body.message.knowledge_graph).toHaveProperty("nodes");
                expect(response.body.message.knowledge_graph).toHaveProperty("edges");
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("MONDO:0001583")
            })
    })

    test("POST /v1/query with query graph defined in old trapi standard", async () => {
        await request(app)
            .post("/v1/query")
            .send(query_using_earlier_trapi_spec)
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

    test("POST /v1/query with query that doesn't provide input category", async () => {
        await request(app)
            .post("/v1/query")
            .send(query_without_category)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toHaveProperty("query_graph");
                expect(response.body.message).toHaveProperty("knowledge_graph");
                expect(response.body.message.knowledge_graph).toHaveProperty("nodes");
                expect(response.body.message.knowledge_graph).toHaveProperty("edges");
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("NCBIGene:5053");
                expect(response.body.message.knowledge_graph.nodes["NCBIGene:5053"]).toHaveProperty("categories", ["biolink:Gene"]);
            })
    })

    // test("POST /v1/query with query that needs to expand node", async () => {
    //     console.log("expanded node", expand_node);
    //     await request(app)
    //         .post("/v1/query")
    //         .send(expand_node)
    //         .set('Accept', 'application/json')
    //         .expect(200)
    //         .expect('Content-Type', /json/)
    //         .then(response => {
    //             console.log(response.body.message.knowledge_graph);
    //             expect(response.body).toHaveProperty("message");
    //             expect(response.body.message).toHaveProperty("query_graph");
    //             expect(response.body.message).toHaveProperty("knowledge_graph");
    //             expect(response.body.message.knowledge_graph).toHaveProperty("nodes");
    //             expect(response.body.message.knowledge_graph).toHaveProperty("edges");
    //             expect(response.body.message.knowledge_graph.nodes).toHaveProperty("REACT:R-HSA-109582");
    //             expect(response.body.message.knowledge_graph.nodes).toHaveProperty("GO:0000082");
    //         })
    // })

})
