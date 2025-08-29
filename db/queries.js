const pool = require('./pool');

async function getAllPokemon(filter = null) {
    let condition = '';

    if (filter) {
        if (Array.isArray(filter)) {
            const status = filter.map(filter => "'" + filter + "'").join(', ');
            condition = `WHERE state IN (${status})`;
        }
        else condition = `WHERE state IN ('${filter}')`
    }

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
    ${condition}
    ORDER BY pokemon_id`);
    
    return rows;
};

async function getPokemon(id) {
    const { rows } = await pool.query(`
        SELECT * FROM pokemon
        WHERE pokemon_id = $1 
    `, [id]);

    return rows[0];
}

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

async function getTrainerNamebyId(id) {
    const { rows } = await pool.query(`
        SELECT name FROM trainers WHERE trainer_id = $1
    `, [id]);

    return rows[0].name;
}

async function getStatusById(id) {
    const { rows } = await pool.query(`
        SELECT state FROM status WHERE status_id = $1
    `, [id]);

    return rows[0].state;
}

async function getTypeById(id) {
    const { rows } = await pool.query(`
        SELECT type FROM types WHERE type_id = $1
    `, [id]);

    return rows[0].type;
}

async function getImgSrcById(id) {
    const { rows } = await pool.query(`
        SELECT img_src FROM pokemon WHERE pokemon_id = $1
    `, [id]);

    return rows[0].img_src;
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
            trainer_id: trainer.trainer_id,
            trainer: trainer.name,
            pokeList: pokeList,
        };
        
        return trainerPokeList;
    });

    return Promise.all(allPokeList);
}

async function getPokeList(id) {
    const { rows } = await pool.query(`
    SELECT DISTINCT pokemon_id, pokemon, nickname, status.state FROM pokemon
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

async function updatePokemon(id, update) {
    const trainerId = await getTrainerIdByName(update.trainer);
    const statusId = await getStatusIdbyState(update.status);
    const firstTypeId = await getTypeIdByType(update.type_one);
    const secondTypeId = await getTypeIdByType(update.type_two);

    await pool.query(`
        UPDATE pokemon SET
        pokemon = $1,
        nickname = $2,
        img_src = $3,
        trainer_id = $4,
        status_id = $5,
        type_id_one = $6,
        type_id_two = $7
        WHERE pokemon_id = $8
    `, [
        update.pokemon,
        update.nickname,
        update.img_src,
        trainerId,
        statusId,
        firstTypeId,
        secondTypeId,
        id
    ])
}

async function deletePokemon(id) {
    await pool.query(`
        DELETE FROM pokemon WHERE pokemon_id = $1
    `, [id]);
}

async function deleteTrainer(id) {
    const pokeList = await getPokeList(id);

    pokeList.forEach(async pokemon => {
        await deletePokemon(pokemon.pokemon_id);
    });

    await pool.query(`
        DELETE FROM trainers WHERE trainer_id = $1
    `, [id]);
};

module.exports = {
    getAllPokemon,
    getPokemon,
    getAllTrainers,
    getAllTypes,
    getAllStatus,
    getTrainerNamebyId,
    getStatusById,
    getTypeById,
    getImgSrcById,
    addPokemontoDb,
    getAllTrainerPokelist,
    addTrainerToDb,
    updatePokemon,
    deletePokemon,
    deleteTrainer,
}