const express = require('express');
const { errors } = require('celebrate');
const routesUsers = require('./users');
const routesMovies = require('./movies');
const routesCreateUser = require('./register');
const routesLogin = require('./login');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/not_found_error');
const { errorLogger } = require('../middlewares/logger');

const routes = express.Router();

routes.use(express.json());

routes.use('/users', auth, routesUsers);
routes.use('/movies', auth, routesMovies);
routes.use('/signup', routesCreateUser);
routes.use('/signin', routesLogin);

routes.use('*', (_req, _res, next) => next(new NotFoundError('Страница не найдена')));

routes.use(errorLogger);

routes.use(errors());

module.exports = routes;
