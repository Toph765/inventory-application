const db = require('../db/queries');

async function getAllTrainersGet(req, res) {
    const allPokeList = await db.getAllTrainerPokelist();
    res.render('trainer', { title: 'Trainers', trainers: allPokeList });
};

async function addNewTrainerGet(req, res) {
    res.render('newTrainer', { title: 'add Trainer' });
};

async function addNewTrainerPost(req, res) {
    const { trainerName } = req.body;

    await db.addTrainerToDb(trainerName);

    res.redirect('/trainer');
};

async function deleteTrainerPost(req, res) {
    const { id } = req.params;

    await db.deleteTrainer(id);

    res.redirect('/trainer');
};

module.exports = {
    getAllTrainersGet,
    addNewTrainerGet,
    addNewTrainerPost,
    deleteTrainerPost,
}