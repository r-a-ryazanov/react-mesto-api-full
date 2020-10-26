const mongoose = require('mongoose');
// eslint-disable-next-line import/no-unresolved
const valid = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /^(https?\:\/\/)(www\.)?[a-z0-9]{1}[-\.\/a-z0-9-]*\.[a-z0-9]{1}[-\/a-z0-9-]*#?$/.test(v);
      },
      message: 'Введите URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return valid.isEmail(v);
      },
      message: 'Введите e-mail',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Not found'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Not found'));
          }
          return user;
        });
    });
};
module.exports = mongoose.model('user', userSchema);
