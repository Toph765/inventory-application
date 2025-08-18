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

    res.redirect('/');
};

module.exports = {
    getAllTrainersGet,
    addNewTrainerGet,
    addNewTrainerPost,
}