/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable object-curly-newline */
/* eslint-disable spaced-comment */

// eslint-disable-next-line import/no-unresolved
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
//-----------------Контроллер добавления нового пользователя---------
module.exports.createUser = (req, res, next) => {
  const { name = 'Имя пользователя', about = 'О пользователе', avatar = 'https://img2.freepng.ru/20180420/uqq/kisspng-user-profile-computer-icons-internet-bot-5ad9d0002bbf61.8168987615242240001792.jpg', email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send({ data: { _id: user._id, email: user.email } }))
    .catch((e) => {
      const err = new Error('Переданы некорректные данные');
      err.statusCode = 400;
      if (e.name === 'MongoError' && e.code === 11000) {
        err.message = 'Пользователь существует';
        err.statusCode = 409;
      }
      next(err);
    });
};
//-------------Контроллер получения информации о всех пользователях---------
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }));
};
//---------------Контроллер получения информации о пользователе------------
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('Not Found'))
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      const err = new Error('Пользователь не найден');
      err.statusCode = 404;
      if (e.name === 'CastError' && e.message !== 'Not Found') {
        err.message = 'Переданы некорректные данные';
        err.statusCode = 400;
      }
      next(err);
    });
};
//---------------Контроллер получения информации о пользователе по ID-----------
module.exports.getUserId = (req, res, next) => {
  User.findById(req.params._id)
    .orFail(new Error('Not Found'))
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      const err = new Error('Пользователь не найден');
      err.statusCode = 404;
      if (e.name === 'CastError' && e.message !== 'Not Found') {
        err.message = 'Переданы некорректные данные';
        err.statusCode = 400;
      }
      next(err);
    });
};

//---------------Контроллер аутентификации------------
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      const data = {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      };
      res.send({ token, data });
    })
    .catch((err) => {
      err.message = 'Передан неверный логин или пароль';
      err.statusCode = 401;

      next(err);
    });
  // eslint-disable-next-line consistent-return
};
