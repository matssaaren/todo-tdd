const TodoModel = require('../models/todo.model');

const createTodo = async (req, res, next) => {
  try {
    const createdModel = await TodoModel.create(req.body);
    res.status(201).json(createdModel);
  } catch (error) {
    next(error);
  }
};

const getTodos = async (req, res, next) => {
  try {
    const todos = await TodoModel.find();
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const todoModel = await TodoModel.findById(req.params.todoId);
    if (todoModel) {
      res.status(200).json(todoModel);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      req.params.todoId,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedTodo) {
      res.status(200).json(updatedTodo);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const deletedTodo = await TodoModel.findByIdAndDelete(req.params.todoId);
    if (deletedTodo) {
      res.status(200).json(deletedTodo);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo
};



