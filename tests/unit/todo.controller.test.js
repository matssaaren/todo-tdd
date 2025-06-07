const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../models/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');
TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  TodoModel.findByIdAndUpdate = jest.fn();

  next = jest.fn();
});

describe('TodoController.createTodo', () => {
  beforeEach(() => {
    req.body = newTodo;
  });

  it('should have a createTodo function', () => {
    expect(typeof TodoController.createTodo).toBe('function');
  });

  it('should call TodoModel.create', () => {
    req.body = newTodo;
    TodoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it('should return 201 response code', async () => {
    await TodoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return JSON response', async () => {
      await TodoModel.create.mockReturnValue(newTodo);
      await TodoController.createTodo(req, res, next);
      expect(res._getJSONData()).toStrictEqual(newTodo);
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise);

    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('TodoController.getTodos', () => {
  it('should have a getTodos function', () => {
    expect(typeof TodoController.getTodos).toBe('function');
  });
  it('should call TodoModel.find', async () => {
    await TodoController.getTodos(req, res, next);
    expect(TodoModel.find).toBeCalled();
  });
  it('should return 200 and all todos', async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(allTodos);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should handle errors in getTodos', async () => {
    const errorMessage = { message: "Error finding todos" };
    TodoModel.find.mockRejectedValue(errorMessage);

    await TodoController.getTodos(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  })
}
);

describe("todoController.getTodoById", () => {
  it("should have a getTodoById function", () => {
    expect(typeof TodoController.getTodoById).toBe("function");
  });
  it("should call TodoModel.findById with route parameters", async () => {
    const todoId = "68445ebdf8dc1887610330bc";
    req.params.todoId = todoId;

    await TodoController.getTodoById(req, res, next);
    expect(TodoModel.findById).toBeCalledWith(todoId);
  });
  it("should return json body and response code 200", async () => {
    TodoModel.findById.mockReturnValue(newTodo);
    req.params.todoId = "65a72dfab5eba9bdce3d1325";

    await TodoController.getTodoById(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(newTodo);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "error finding todoModel" };
    TodoModel.findById.mockRejectedValue(errorMessage);

    await TodoController.getTodoById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
  it("should return 404 when item does not exist", async () => {
    TodoModel.findById.mockReturnValue(null);
    req.params.todoId = "nonexistentid";

    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });


});

describe("todoController.updateTodo", () => {
  it("should have an updateTodo function", () => {
    expect(typeof TodoController.updateTodo).toBe("function");
  });
  const todoId = "65a72dfab5eba9bdce3d1325";

  it("should call findByIdAndUpdate with req.params.todoId and req.body", async () => {
    req.params.todoId = todoId;
    req.body = newTodo;

    await TodoController.updateTodo(req, res, next);
    expect(TodoModel.findByIdAndUpdate).toBeCalledWith(todoId, newTodo, {
      new: true,
      runValidators: true
    });
  });
  it("should return 200 and updated todo", async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);

    await TodoController.updateTodo(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(newTodo);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "error updating todo" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);

    await TodoController.updateTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
  it("should return 404 when todo doesn't exist", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    req.params.todoId = "nonexistentid";

    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

});
