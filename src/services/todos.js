import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../database.js';
import { DataTypes } from 'sequelize';

const Todo = sequelize.define(
  'Todo',
  {
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'todos'
  }
);

export async function getAllTodos() {
  return await Todo.findAll();
}

export async function getById(todoId) {
  const result = await client.query(`
    SELECT *
    FROM todos
    WHERE id=$1
`, [todoId]);
  
  return result.rows[0] || null;
}

export async function createTodo(title) {
  const id = uuidv4();
  const idToInt = id.substring(0, 6).replace(/\D/g,'')
  
  await client.query(`
    INSERT INTO todos (id, title)
    VALUES ($1, $2)
`, [idToInt, title]);

  return await getById(idToInt);
}

export async function remove(todoId) {
  await client.query(`
    DELETE FROM todos
    WHERE id=$1
`, [todoId]);
}

export async function removeMany(ids) {
  await client.query(`
    DELETE FROM todos
    WHERE id IN (${
    ids.map(id => `'${id}'`).join(',')
    })
`);
}

export async function update({ id, title, completed }) {
  await client.query(`
    UPDATE todos
    SET title=$1, completed=$2
    WHERE id=$3
`, [title, completed, id]);
}

export async function updateMany(todos) {
  for (const { id, title, completed } of todos) {
   await update({ id, title, completed });
  }
}
