const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createCard, getCards, deleteCard } = require('../controllers/cards.js');
const auth = require('../middlewares/Auth');

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2),
  }),
}), auth, createCard);
cardsRouter.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().min(2),
  }).unknown(true),
}), auth, deleteCard);
cardsRouter.get('/', auth, getCards);
module.exports = cardsRouter;
