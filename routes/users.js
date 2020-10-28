/* eslint-disable object-curly-newline */
const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createUser, getUsers, getUser, login, getUserId } = require('../controllers/users.js');

// eslint-disable-next-line import/no-unresolved
const auth = require('../middlewares/Auth');

usersRouter.get('/users', auth, getUsers);
usersRouter.get('/users/me', auth, getUser);
usersRouter.get('/users/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().required().min(2),
  }).unknown(true),
}), auth, getUserId);
usersRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().pattern(/^\S*$/).required().min(8),
  }),
}), createUser);
usersRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().pattern(/^\S*$/).required().min(8),
  }),
}), login);

module.exports = usersRouter;
