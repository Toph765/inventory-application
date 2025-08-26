const { Router } = require('express');
const trainerController = require('../controller/trainerController');
const trainerRouter = Router();

trainerRouter.get('/', trainerController.getAllTrainersGet);
trainerRouter.post('/new', trainerController.addNewTrainerPost);
trainerRouter.post('/:id/delete', trainerController.deleteTrainerPost);

module.exports = trainerRouter;
