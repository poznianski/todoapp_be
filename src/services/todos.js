import { Todo } from '../models/Todo.js';
import { sequelize } from '../db.js';
import { Op } from 'sequelize';

export async function getAllTodos() {
  return await Todo.findAll({
    order: ['created_at'],
  });
}

export function normalize({ id, title, completed }) {
  return { id, title, completed };
}

export function getById(todoId) {
  return Todo.findByPk(todoId);
}

export function createTodo(title) {
  return Todo.create({ title });
}

export async function remove(todoId) {
  return Todo.destroy({
    where: { id: todoId },
  });
}

export async function removeMany(ids) {
  return Todo.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
}

export async function update({ id, title, completed }) {
  return await Todo.update(
    { title, completed },
    {
      where: { id },
    }
  );
}

export async function updateMany(todos) {
  const t = await sequelize.transaction();

  try {
    for (const { id, title, completed } of todos) {
      await Todo.update(
        { title, completed },
        {
          where: { id },
          transaction: t,
        }
      );
    }

    await t.commit();
  } catch (err) {
    await t.rollback();
  }
}
