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

async function getAllTrainers() {
    const { rows } = await pool.query(`SELECT * FROM trainers`);
    
    return rows;
};

async function getAllTypes() {
    const { rows } = await pool.query(`SELECT * FROM types`);

    return rows;
}

async function getAllStatus() {
    const { rows } = await pool.query(`SELECT * FROM status`);

    return rows;
}

async function getTrainerIdByName(name) {
    const trainerList = await getAllTrainers();
    const trainer = trainerList.filter(trainer => trainer.name === name)[0];
    return trainer.trainer_id;
}

async function getStatusIdbyState(state) {
    const statusList = await getAllStatus();
    const status = statusList.filter(status => status.state === state)[0];
    return status.status_id;
}

async function getTypeIdByType(type) {
    const typeList = await getAllTypes();
    const typeName = typeList.filter(item => item.type === type)[0];
    return typeName.type_id;
}

async function addPokemontoDb(newPokemon) {
    const trainerId = await getTrainerIdByName(newPokemon.trainer);
    const statusId = await getStatusIdbyState(newPokemon.status);
    const firstTypeId = await getTypeIdByType(newPokemon.type_one);
    const secondTypeId = await getTypeIdByType(newPokemon.type_two);

    await pool.query(`
    INSERT INTO pokemon (pokemon, nickname, img_src, trainer_id, status_id, type_id_one, type_id_two)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
        newPokemon.pokemon,
        newPokemon.nickname,
        newPokemon.img_src,
        trainerId,
        statusId,
        firstTypeId,
        secondTypeId,
    ]);
}

async function getAllTrainerPokelist() {
    const trainers = await getAllTrainers();

    const allPokeList = trainers.map(async trainer => {
        const pokeList = await getPokeList(trainer.trainer_id);
        const trainerPokeList = {
            trainer: trainer.name,
            pokeList: pokeList,
        };
        
        return trainerPokeList;
    });

    return Promise.all(allPokeList);
}

async function getPokeList(id) {
    const { rows } = await pool.query(`
    SELECT DISTINCT pokemon, nickname, status.state FROM pokemon
    INNER JOIN status ON pokemon.status_id = status.status_id
    INNER JOIN trainers ON pokemon.trainer_id = $1
    `, [id]);

    return rows;
}

async function addTrainerToDb(name) {
    await pool.query(`
        INSERT INTO trainers (name)
        VALUES ($1)
    `, [name]);
};

async function deletePokemon(id) {
    await pool.query(`
        DELETE FROM pokemon WHERE pokemon_id = $1
    `, [id]);
}

module.exports = {
    getAllPokemon,
    getAllTrainers,
    getAllTypes,
    getAllStatus,
    addPokemontoDb,
    getAllTrainerPokelist,
    addTrainerToDb,
    deletePokemon,
}