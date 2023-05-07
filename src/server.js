import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router as todosRouter } from './routes/todos.js';
import { sequelize } from './db.js';

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use('/todos', express.json(), todosRouter);

app.get('/users', (req, res) => {
  res.send([]);
});

app.listen(port, () => {
  console.log(`App started at port ${port}`);
});

const isConnectedToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

await isConnectedToDatabase();
