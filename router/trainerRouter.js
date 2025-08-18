const { Router } = require('express');
const trainerController = require('../controller/trainerController');
const trainerRouter = Router();

trainerRouter.get('/', trainerController.getAllTrainersGet);
trainerRouter.get('/new', trainerController.addNewTrainerGet);
trainerRouter.post('/new', trainerController.addNewTrainerPost);

module.exports = trainerRouter;
