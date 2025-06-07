const request = require('supertest');
const app = require('../../app');
const newTodo = require('../mock-data/new-todo.json');

const endpointUrl = '/todos/';
let firstTodo;
let newTodoId;
const testData = { title: "Updated title", done: true };
beforeAll(async () => {
  const response = await request(app).get("/todos");
  firstTodo = response.body[0];
});

describe(endpointUrl, () => {
  it('POST ' + endpointUrl, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send(newTodo);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
  });
  it("should return error 500 on malformed data with POST " + endpointUrl, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({ title: "Missing done property" });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({message: "Todo validation failed: done: Path `done` is required."});
  });
  it("should return todo by id", async () => {
    const response = await request(app).get(`/todos/${firstTodo._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });
  it("should return 404 when todo doesn't exist", async () => {
    const fakeId = "65ae744d7702e654986429f5";
    const response = await request(app).get(`/todos/${fakeId}`);
    expect(response.statusCode).toBe(404);
  });
  it("should update todo by id", async () => {
    const postResponse = await request(app)
      .post("/todos")
      .send({ title: "Update test", done: false });
    newTodoId = postResponse.body._id;

    const updateResponse = await request(app)
      .put(`/todos/${newTodoId}`)
      .send(testData);

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.title).toBe(testData.title);
    expect(updateResponse.body.done).toBe(testData.done);
  });
  it("should return 404 when todo to update not found", async () => {
    const fakeId = "65ae744d7702e654986429f5";
    const response = await request(app)
      .put(`/todos/${fakeId}`)
      .send(testData);

    expect(response.statusCode).toBe(404);
  });

});
