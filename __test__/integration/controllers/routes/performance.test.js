const app = require("../../../../src/app");
const request = require('supertest');

describe("Test /performance endpoint", () => {
    test("Should return 200 with valid response", async () => {
        await request(app)
            .get("/performance")
            .expect(200)
            .expect('Content-Type', /html/)
    })
})