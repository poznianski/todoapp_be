import * as todoService from '../services/todos.js';

export const getAll = async (req, res) => {
  const todos = await todoService.getAllTodos();
  res.send(todos.map(todoService.normalize));
};

export const getOne = async (req, res) => {
  const { todoId } = req.params;
  const foundTodo = await todoService.getById(todoId);

  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  res.send(todoService.normalize(foundTodo));
};

export const add = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.sendStatus(422);
    return;
  }

  const newTodo = await todoService.createTodo(title);

  res.statusCode = 201;

  res.send(todoService.normalize(newTodo));
};

export const remove = async (req, res) => {
  const { todoId } = req.params;
  const foundTodo = todoService.getById(todoId);

  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  await todoService.remove(todoId);
  res.sendStatus(204);
};

export const removeMany = (req, res) => {
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

export const update = async (req, res) => {
  const { todoId } = req.params;
  const foundTodo = await todoService.getById(todoId);

  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  const { title, completed } = req.body;

  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    res.sendStatus(422);
    return;
  }

  await todoService.update({ id: todoId, title, completed });

  const updatedTodo = todoService.getById(todoId);

  res.send(updatedTodo);
};

export const updateMany = (req, res) => {
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
