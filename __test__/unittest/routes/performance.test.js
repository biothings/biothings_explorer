const app = require("../../../src/app");
const request = require('supertest');
const fs = require("fs");


describe("Test /performance endpoint", () => {
    test("Should return 404 with valid response", async () => {
        const spy = jest.spyOn(fs, 'access').mockImplementation(() => { throw new Error() });
        await request(app)
            .get("/performance")
            .expect(404)
            .expect('Content-Type', /json/)
        spy.mockRestore();
    })
})