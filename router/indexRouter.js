const { Router } = require('express');
const indexController = require('../controller/indexController');
const indexRouter = Router();

indexRouter.get('/', indexController.getAllPokemonGet);
// indexRouter.get('/new', indexController.addNewPokemonGet);
// indexRouter.post('/new', indexController.addNewPokemonPost);

module.exports = indexRouter;