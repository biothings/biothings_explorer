const app = require("../../../../src/app");
const request = require('supertest');

describe("Test /v1/team/{team_name}/predicates endpoint", () => {
    test("Query to Text Mining team Should return 200 with valid response", async () => {
        await request(app)
            .get("/v1/team/Text Mining Provider/predicates")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("biolink:Gene");
                expect(response.body["biolink:Gene"]).toHaveProperty("biolink:ChemicalSubstance");
            })
    })

    test("Query to Invalid team Should return 200 with empty response", async () => {
        await request(app)
            .get("/v1/team/wrong team/predicates")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toEqual([]);
            })
    })

})