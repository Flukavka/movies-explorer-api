const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
  //  likeCard,
} = require('../controllers/movies');
const { REG_EXP_LINK } = require('../utils/constants');

const router = express.Router();

//  возвращает все сохранённые текущим пользователем фильмы
router.get('/', getMovies);

//  создаёт фильм с переданными в теле
//  country, director, duration, year, description, image, trailer, nameRU,
//  nameEN и thumbnail, movieId, owner
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required().min(2),
    image: Joi.string().required().pattern(REG_EXP_LINK),
    trailerLink: Joi.string().required().pattern(REG_EXP_LINK),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
    thumbnail: Joi.string().required().pattern(REG_EXP_LINK),
    movieId: Joi.string().hex(),
    owner: Joi.string().length(24).hex(),
  }).unknown(true),
}), express.json(), createMovie);

//  удаляет сохранённый фильм по id
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }).unknown(true),
}), deleteMovie);

module.exports = router;
