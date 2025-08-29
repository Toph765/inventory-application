const db = require('../db/queries');

async function getAllPokemonGet(req, res) {
    const status = await db.getAllStatus();
    const filter = req.query.status;
    const allPokemon = await db.getAllPokemon(filter);

    res.render('index', {
        title: 'Home',
        allPokemon: allPokemon,
        status: status,
        filter: filter,
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

async function editPokemonGet(req, res) {
    const { id } = req.params;

    const pokemon = await db.getPokemon(id);
    const currentTrainer = await db.getTrainerNamebyId(pokemon.trainer_id);
    const currentStatus = await db.getStatusById(pokemon.status_id)
    const typeOne = await db.getTypeById(pokemon.type_id_one);
    const typeTwo = await db.getTypeById(pokemon.type_id_two);
    const trainers = await db.getAllTrainers();
    const status = await db.getAllStatus();
    const types = await db.getAllTypes();

    res.render('editIndex', {
        title: 'Edit',
        pokemon_id: pokemon.pokemon_id,
        pokemon: pokemon.pokemon,
        nickname: pokemon.nickname,
        img_src: pokemon.img_src,
        currentTrainer: currentTrainer,
        currentStatus: currentStatus,
        currentFirstType: typeOne,
        currentSecondType: typeTwo,
        trainers: trainers,
        status: status,
        types: types,
    })
}

async function editPokemonPost(req, res) {
    const { pokemon, nickname, trainer, status, type_one, type_two } = req.body;
    const { id } = req.params;
    const imgSrc = await db.getImgSrcById(id);
    
    const update = {
        pokemon: pokemon,
        nickname: nickname,
        img_src: req.file ? `/uploads/${req.file.filename}` : imgSrc,
        trainer: trainer,
        status: status,
        type_one: type_one,
        type_two: type_two,
    }

    await db.updatePokemon(id, update);
    
    res.redirect('/');
};

async function deletePokemonPost(req, res) {
    const { id } = req.params;

    await db.deletePokemon(id);

    res.redirect('/');
}

module.exports = {
    getAllPokemonGet,
    addNewPokemonGet,
    addNewPokemonPost,
    deletePokemonPost,
    editPokemonGet,
    editPokemonPost,
}