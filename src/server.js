import express from 'express';
import cors from 'cors';
import { router as todosRouter} from './routes/todos.js'

const app = express();

app.use(cors());
app.use('/todos', express.json(), todosRouter)

app.get('/users', (req, res) => {
  res.send([])
})

app.listen(3001);
