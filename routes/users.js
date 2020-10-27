/* eslint-disable object-curly-newline */
const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createUser, getUsers, getUser, login } = require('../controllers/users.js');

// eslint-disable-next-line import/no-unresolved
const auth = require('../middlewares/Auth');

usersRouter.get('/', auth, getUsers);
usersRouter.get('/me', auth, getUser);
usersRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
usersRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

module.exports = usersRouter;
