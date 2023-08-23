const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth');
const {
  getCurrentUserInfo,
  updateUserProfile,
} = require('../controllers/users');

const router = express.Router();

//  получает данные залогиненного пользователя
router.get('/me', auth, getCurrentUserInfo);

//  обновляет профиль
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }).unknown(true),
}), updateUserProfile);

module.exports = router;
