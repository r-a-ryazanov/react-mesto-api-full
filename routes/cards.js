const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createCard, getCards, deleteCard } = require('../controllers/cards.js');
// eslint-disable-next-line import/no-unresolved
const auth = require('../middlewares/Auth');

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().required().pattern(/^(https?\:\/\/)(www\.)?[a-z0-9]{1}[-\.\/a-z0-9-]*\.[a-z0-9]{1}[-\/a-z0-9-]*#?$/),
  }),
}), auth, createCard);
cardsRouter.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().required().min(2),
  }).unknown(true),
}), auth, deleteCard);
cardsRouter.get('/', auth, getCards);
module.exports = cardsRouter;
