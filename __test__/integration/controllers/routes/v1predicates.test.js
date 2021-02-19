const app = require("../../../../src/app");
const request = require('supertest');

describe("Test /v1/predicates endpoint", () => {
    test("Should return 200 with valid response", async () => {
        await request(app)
            .get("/v1/predicates")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("biolink:Gene");
                expect(response.body["biolink:Gene"]).toHaveProperty("biolink:ChemicalSubstance");
                expect(response.body["biolink:Gene"]["biolink:ChemicalSubstance"]).toContain("biolink:related_to");
            })
    })
})