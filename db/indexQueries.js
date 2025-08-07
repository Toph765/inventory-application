const pool = require('./pool');

async function getAllPokemon() {
    const { rows } = await pool.query(`
    SELECT 
        pokemon.pokemon_id,
        pokemon.pokemon,
        pokemon.nickname,
        pokemon.img_src,
        trainers.name AS trainer_name,
        status.state AS state,
        first_typing.type AS first_type,
        second_typing.type AS second_type
    FROM pokemon
    LEFT JOIN trainers ON pokemon.trainer_id = trainers.trainer_id
    LEFT JOIN status ON pokemon.status_id = status.status_id
    LEFT JOIN types AS first_typing ON pokemon.type_id_one = first_typing.type_id
    LEFT JOIN types AS second_typing ON pokemon.type_id_two = second_typing.type_id
    ORDER BY pokemon_id`);
    
    return rows;
};

module.exports = {
    getAllPokemon,
}