const db = require('../db/indexQueries');

async function getAllPokemonGet(req, res) {
    const allPokemon = await db.getAllPokemon();
    res.render('index', {
        title: 'Home',
        allPokemon: allPokemon,
    });
};

async function addNewPokemonGet(req, res) {
    const trainers = await db.getAllTrainers();
    const status = await db.getAllStatus();
    const types = await db.getAllTypes();

    res.render('newPokemon', {
        title: 'New Pokemon',
        trainers: trainers,
        status: status,
        types: types,
    });
};

async function addNewPokemonPost(req, res) {
    const { pokemon, nickname, trainer, status, type_one, type_two } = req.body;

    const newPokemon = {
        pokemon: pokemon,
        nickname: nickname,
        img_src: req.file ? `/uploads/${req.file.filename}` : '/images/Substitute_artwork.png',
        trainer: trainer,
        status: status,
        type_one: type_one,
        type_two: type_two,
    };

    await db.addPokemontoDb(newPokemon);
    res.redirect('/');
}

module.exports = {
    getAllPokemonGet,
    addNewPokemonGet,
    addNewPokemonPost,
}