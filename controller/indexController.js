const db = require('../db/indexQueries');

async function getAllPokemonGet(req, res) {
    const allPokemon = await db.getAllPokemon();
    res.render('index', {
        title: 'Home',
        allPokemon: allPokemon,
    });
};


module.exports = {
    getAllPokemonGet,
}