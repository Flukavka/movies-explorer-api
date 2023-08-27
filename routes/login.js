const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();

const { auth } = require('../middlewares/auth');
const {
  login,
} = require('../controllers/users');

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), login, auth);

module.exports = router;
