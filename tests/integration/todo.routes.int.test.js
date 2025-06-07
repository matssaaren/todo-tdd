const request = require("supertest");
const app = require("../../app");

describe("GET /todos", () => {
  it("should return 200 and a list", async () => {
    const response = await request(app).get("/todos");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it("should contain todo objects", async () => {
    const response = await request(app).get("/todos");
    expect(response.body[0]).toHaveProperty("title");
    expect(response.body[0]).toHaveProperty("done");
  });
});
