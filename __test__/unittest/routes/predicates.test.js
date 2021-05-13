const app = require("../../../src/app");
const request = require('supertest');
const pred = require("../../../src/controllers/predicates");
const PredicateLoadingError = require("../../../src/utils/errors/predicates_error");
const PredicatesLoadingError = require("../../../src/utils/errors/predicates_error");
jest.mock('../../../src/controllers/predicates');



describe("Test /v1/meta_knowledge_graph endpoint", () => {


    test("Should return 404 with valid response", async () => {
        pred.mockImplementation(() => {
            throw new PredicatesLoadingError();
        })
        await request(app)
            .get("/v1/meta_knowledge_graph")
            .expect(404)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).toHaveProperty('error', "Unable to load predicates")
            })
    })
})