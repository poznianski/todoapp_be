import * as todoService from '../services/todos.js';

export const getAll = (req, res) => {
  const todos = todoService.getAllTodos();
  res.send(todos);
};

export const getOne = (req, res) => {
  const { todoId } = req.params;
  const foundTodo = todoService.getById(todoId);

  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  res.send(foundTodo);
};

export const add = (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.sendStatus(422);
    return;
  }

  const newTodo = todoService.createTodo(title);

  res.statusCode = 201;

  res.send(newTodo);
};

export const remove = (req, res) => {
  const { todoId } = req.params;
  const foundTodo = todoService.getById(todoId);

  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  todoService.remove(todoId);
  res.sendStatus(204);
};

export const update = (req, res) => {
  const { todoId } = req.params;
  const foundTodo = todoService.getById(todoId);

  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  const { title, completed } = req.body;

  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    res.sendStatus(422);
    return;
  }

  todoService.update({ id: todoId, title, completed });

  res.send(foundTodo);
};

export const removeMany = (req, res, next) => {
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    res.sendStatus(422);
    return;
  }

  try {
    todoService.removeMany(ids);
  } catch (e) {
    res.sendStatus(404);
  }

  res.sendStatus(204);
};

export const updateMany = (req, res, next) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.sendStatus(422);
    return;
  }

  const results = [];
  const errors = [];

  for (const { id, title, completed } of items) {
    const foundTodo = todoService.getById(id);

    if (foundTodo) {
      todoService.update({ id, title, completed });
      results.push({ id, status: 'Ok' });
    } else {
      errors.push({ id, status: 'Not found' });
    }
  }

  res.send({ results, errors });
};
