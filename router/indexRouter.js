const { Router } = require('express');
const indexController = require('../controller/indexController');
const indexRouter = Router();
const { upload } = require('../controller/uploadMiddleware');

indexRouter.get('/', indexController.getAllPokemonGet);
indexRouter.get('/new', indexController.addNewPokemonGet);
indexRouter.post('/new', upload.single('image_src'), indexController.addNewPokemonPost);
indexRouter.post('/:id/delete', indexController.deletePokemonPost);

module.exports = indexRouter;