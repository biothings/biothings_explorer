const app = require("../../../src/app");
const request = require('supertest');

// no one is really using the BTE /metakg endpoint and it is not publically advertised in its SmartAPI registration...
describe("Test /metakg endpoint", () => {
    test("Should return 200 with valid response using default values", async () => {
        await request(app)
            .get("/metakg")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("associations");
                expect(response.body.associations.length).toBeGreaterThan(100);
            })
    })

    test("Should return 200 with valid response when user specify api", async () => {
        await request(app)
            .get("/metakg?api=MyGene.info API")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("associations");
                const apis = Array.from(new Set(response.body.associations.map(item => item.api.name)));
                expect(apis).toEqual(['MyGene.info API']);
            })
    })

    test("Should return 200 with valid response when user specify provided by", async () => {
        await request(app)
            .get("/metakg?provided_by=infores:disgenet")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("associations");
                const res = Array.from(new Set(response.body.associations.map(item => item.provided_by)));
                expect(res).toEqual(['infores:disgenet']);
            })
    })

    test("Should return 200 with valid response when user specify subject", async () => {
        await request(app)
            .get("/metakg?subject=Gene")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("associations");
                const res = Array.from(new Set(response.body.associations.map(item => item.subject)));
                expect(res).toEqual(['Gene']);
            })
    })

    test("Should return 200 with valid response when user specify object", async () => {
        await request(app)
            .get("/metakg?object=Gene")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("associations");
                const res = Array.from(new Set(response.body.associations.map(item => item.object)));
                expect(res).toEqual(['Gene']);
            })
    })

    test("Should return 200 with empty response when user specify invalid object", async () => {
        await request(app)
            .get("/metakg?object=Gene1")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("associations");
                expect(response.body.associations).toEqual([]);
            })
    })

    test("Should return 200 with valid response when user specify both subject and object", async () => {
        await request(app)
            .get("/metakg?object=Gene&subject=SmallMolecule")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("associations");
                const objs = Array.from(new Set(response.body.associations.map(item => item.object)));
                const subjs = Array.from(new Set(response.body.associations.map(item => item.subject)));
                expect(objs).toEqual(['Gene']);
                expect(subjs).toEqual(['SmallMolecule']);
            })
    })

    test("Should return info from TRAPI /meta_knowledge_graph endpoint", async () => {
        await request(app)
            .get("/metakg")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("associations");
                const apis = Array.from(new Set(response.body.associations.map(item => item.api.name)));
                expect(apis).toContain("BioLink API");
            })
    })
})