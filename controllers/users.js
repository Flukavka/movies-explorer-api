const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad_request_error');
const ConflictError = require('../errors/conflict_error');
//  const NotFoundError = require('../errors/not_found_error');
const {
  OK_STATUS,
  CREATED_SUCCESS_STATUS,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      ...req.body,
      password: hash,
    }))
    .then((user) => {
      res.status(CREATED_SUCCESS_STATUS).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Ошибка валидации'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        { expiresIn: '7d' },
      );
      return res.status(OK_STATUS).send({ token });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Ошибка валидации'));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (user) {
        res.status(OK_STATUS).send({ name: user.name, email: user.email });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;

  User
    .findByIdAndUpdate(
      id,
      { name, email },
      { returnDocument: 'after', runValidators: true, new: true },
    )
    .then((user) => {
      if (user) {
        res.status(OK_STATUS).send({
          name,
          email,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};
