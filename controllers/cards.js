/* eslint-disable spaced-comment */
const Card = require('../models/card');
//-----------------Контроллер добавления новой карточки---------
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    // eslint-disable-next-line no-unused-vars
    .catch((e) => {
      const err = new Error('Переданы некорректные данные');
      if (e.name === 'ValidationError') {
        err.statusCode = 400;
        next(err);
      }
    });
};
//-----------------Контроллер получения данных всех карточек---------
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send( cards ));
};
//----------------Контроллер удаления карточки---------------
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .orFail(new Error('Not Found'))
    .then((data) => {
      if (data) {
        // eslint-disable-next-line eqeqeq
        if (req.user._id == data.owner._id) {
          Card.findByIdAndRemove(req.params._id)
            .then((card) => res.send({ data: card }));
          // eslint-disable-next-line no-unused-vars
        }
      }
    })
    .catch((e) => {
      const err = new Error('Переданы некорректные данные');
      if (e.message === 'Not Found') {
        err.message = 'Карточка не найдена';
        err.statusCode = 404;
      } else if (e.name === 'CastError') {
        err.statusCode = 400;
      }
      next(err);
    });
};
