const app = require("../../../src/app");
const request = require('supertest');
const assoc = require("../../../src/controllers/association");
jest.mock('../../../src/controllers/association');

describe("Test /performance endpoint", () => {


    test("Should return 404 when loading metakg failed", async () => {
        assoc.mockImplementation(() => {
            throw new Error("Error")
        })
        await request(app)
            .get("/metakg")
            .expect(404)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).toHaveProperty("error", "Unable to load metakg")
            })
    })
})