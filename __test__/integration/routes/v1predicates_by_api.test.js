const app = require("../../../src/app");
const request = require('supertest');

describe.skip("Test /v1/smartapi/{smartapi_id}/predicates endpoint", () => {
    test("Query to Text Mining Targeted Association API Should return 200 with valid response", async () => {
        await request(app)
            .get("/v1/smartapi/978fe380a147a8641caf72320862697b/predicates")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("biolink:Gene");
                expect(response.body["biolink:Gene"]).toHaveProperty("biolink:ChemicalSubstance");
            })
    })

    test("Query to Invalid API Should return 404 with error message included", async () => {
        await request(app)
            .get("/v1/smartapi/78fe380a147a8641caf72320862697b/predicates")
            .expect(404)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("error", "Unable to load predicates");
                expect(response.body).toHaveProperty("more_info", "Failed to Load MetaKG");
            })
    })
})