import * as todoControllers from '../controllers/todos.js';
import express from 'express';

export const router = express.Router();

router.get('/', todoControllers.getAll);
router.get('/:todoId', todoControllers.getOne);

router.post('/', todoControllers.add);
router.delete('/:todoId', todoControllers.remove);
router.put('/:todoId', todoControllers.update);

const hasAction = (action) => {
  return (req, res, next) => {
    if (req.query.action === action) {
      next();
    } else {
      next('route');
    }
  };
};

router.patch('/', hasAction('delete'), todoControllers.removeMany);
router.patch('/', hasAction('update'), todoControllers.updateMany);

router.patch('/sdfsdf', (req, res) => {
  const { action } = req.query;

  if (action === 'delete') {
    todoControllers.removeMany(req, res);
    return;
  }

  if (action === 'update') {
    todoControllers.updateMany(req, res);
  }

  res.sendStatus(400);
});
