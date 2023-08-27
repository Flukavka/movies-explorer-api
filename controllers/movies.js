const Movie = require('../models/movie');
const NotFoundError = require('../errors/not_found_error');
const ForbiddenStatus = require('../errors/forbidden_status');
const {
  OK_STATUS,
  CREATED_SUCCESS_STATUS,
} = require('../utils/constants');

//  возвращает все сохранённые текущим пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  console.log(owner);
  Movie.find({ owner })
    .then((movies) => res.status(OK_STATUS).send(movies))
    .catch((err) => {
      next(err);
    });
};

//  создаёт фильм с переданными в теле
//  country, director, duration, year, description, image, trailer, nameRU,
//  nameEN и thumbnail, movieId, owner
module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;

  return Movie.create({
    owner,
    ...req.body,
  })
    .then((movie) => res.status(CREATED_SUCCESS_STATUS).send(movie))
    .catch((err) => {
      next(err);
    })
    .catch(next);
};

//  удаляет сохранённый фильм по id
module.exports.deleteMovie = (req, res, next) => Movie.findById(req.params._id)
  .then((movie) => {
    if (!movie) {
      next(new NotFoundError('Нет фильма с таким id'));
    } else if (movie.owner.toString() === req.user._id) {
      return Movie.deleteOne(movie).then(() => res.status(OK_STATUS).send(movie));
    }

    return next(new ForbiddenStatus('Отказано в доступе'));
  })
  .catch((err) => {
    next(err);
  })
  .catch(next);
