const app = require("../../src/app");
const request = require('supertest');

describe("Testing v1 async", () => {

    let query = {
        "callback": "http://google.com",
        "message": {
            "query_graph": {
                "edges": {
                    "e00": {
                        "subject": "n0",
                        "object": "n1"
                    }
                },
                "nodes": {
                    "n1": {
                        "categories": [
                            "biolink:SmallMolecule"
                        ]
                    },
                    "n0": {
                        "categories": [
                            "biolink:Gene"
                        ],
                        "ids": ["NCBIGene:3778"]
                    }
                }
            }
        }
    }

    let query2 = {
        "callback": "http://google.com",
        "message": {
            "query_graph": {
                "nodes": {
                    "n0": {
                        "ids": ["MESH:D000077185"],
                        "categories": [
                            "biolink:ChemicalEntity"
                        ],
                        "name": "Resveratrol"
                    },
                    "n1": {
                        "categories": [
                            "biolink:DiseaseOrPhenotypicFeature"
                        ]
                    }
                },
                "edges": {
                    "e0": {
                        "subject": "n0",
                        "object": "n1",
                        "predicates": ["biolink:treats", "biolink:has_real_world_evidence_of_association_with"]
                    }
                }
            }
        }
    }

    let query3 = {
        "callback": "http://google.com",
        "message": {
            "query_graph": {
                "nodes": {
                    "n0": {
                        "ids": ["PUBCHEM.COMPOUND:5877", "PUBCHEM.COMPOUND:124653", "PUBCHEM.COMPOUND:6741"],
                        "categories": [
                            "biolink:ChemicalEntity"
                        ],
                        "name": "Methylprednisone"
                    },
                    "n1": {
                        "categories": [
                            "biolink:DiseaseOrPhenotypicFeature"
                        ]
                    }
                },
                "edges": {
                    "e0": {
                        "subject": "n0",
                        "object": "n1",
                        "predicates": ["biolink:treats", "biolink:has_real_world_evidence_of_association_with"]
                    }
                }
            }
        }
    }

    test("POST /v1/asyncquery", async (done) => {
        await request(app)
            .post("/v1/asyncquery")
            .send(query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toHaveProperty("id");
                expect(response.body.message).toHaveProperty("url");
                let async_res = done();
                expect(async_res);
            })
    })

    test("POST /v1/asyncquery", async (done) => {
        await request(app)
            .post("/v1/asyncquery")
            .send(query2)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toHaveProperty("id");
                expect(response.body.message).toHaveProperty("url");
                let async_res = done();
                expect(async_res);
            })
    })

    test("POST /v1/asyncquery", async (done) => {
        await request(app)
            .post("/v1/asyncquery")
            .send(query3)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toHaveProperty("id");
                expect(response.body.message).toHaveProperty("url");
                let async_res = done();
                expect(async_res);
            })
    })

})
