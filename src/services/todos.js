import { v4 as uuidv4 } from 'uuid';
import pkg from 'pg';
const { Client } = pkg
import dotenv from 'dotenv';
dotenv.config()

const client = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
})

await client.connect()

const result = await client.query(`
SELECT *
FROM todos
`)

console.log(result.rows)

let todos = [
  { id: '1', title: 'HTML', completed: true },
  { id: '2', title: 'CSS', completed: false },
  { id: '3', title: 'JS', completed: false },
];

export function getAllTodos() {
  return todos;
}

export function getById(todoId) {
  const foundTodo = todos.find((todo) => todo.id === todoId);

  return foundTodo || null;
}

export function createTodo(title) {
  const newTodo = {
    id: uuidv4(),
    title,
    completed: false,
  };

  todos.push(newTodo);

  return newTodo;
}

export function remove(todoId) {
  todos = todos.filter((todo) => todo.id !== todoId);
}

export function removeMany(ids) {
  if(!ids.every(getById)) {
    throw new Error()
  }
  todos= todos.filter((todo) => ids.includes(todo.id));
}

export function update({ id, title, completed }) {
  const todo = getById(id);

  Object.assign(todo, { title, completed });

  return todo;
}

export function updateMany(todos) {
  for (const { id, title, completed } of todos) {
    const foundTodo = getById(id);
    
    if (!foundTodo) {
      continue;
    }
    
    update({id, title, completed})
  }
}
