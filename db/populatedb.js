const { Client } = require('pg');
require('dotenv').config();

const SQL = `
    CREATE TABLE IF NOT EXISTS trainers (
        trainer_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (255)
    );

    CREATE TABLE IF NOT EXISTS status (
        status_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        state VARCHAR (255)
    );

    CREATE TABLE IF NOT EXISTS types (
        type_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        type VARCHAR (255)
    );

    CREATE TABLE IF NOT EXISTS pokemon (
        pokemon_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        pokemon VARCHAR (255),
        nickname VARCHAR (255),
        img_src TEXT,
        trainer_id INTEGER,
        status_id INTEGER,
        type_id_one INTEGER,
        type_id_two INTEGER,
        FOREIGN KEY (trainer_id) REFERENCES trainers (trainer_id),
        FOREIGN KEY (status_id) REFERENCES status (status_id),
        FOREIGN KEY (type_id_one) REFERENCES types (type_id),
        FOREIGN KEY (type_id_two) REFERENCES types (type_id)
    );
    
    INSERT INTO trainers (name)
    VALUES
    ('None'), ('Red'), ('Blue'), ('Brock'), ('Misty');

    INSERT INTO status (state)
    VALUES
    ('paralyzed'), ('poisoned'), ('frozen'), ('burned'), ('asleep'), ('confused'), ('fainted');

    INSERT INTO types (type)
    VALUES
    ('none'), ('Normal'), ('Fire'), ('Water'), ('Electric'), ('Grass'), ('Ice'), ('Fighting'), ('Poison'), ('Ground'), ('Flying'), ('Psychic'), ('Bug'), ('Rock'), ('Ghost'), ('Dragon'), ('Dark'), ('Steel'), ('Fairy');

    INSERT INTO pokemon (pokemon, nickname, img_src, trainer_id, status_id, type_id_one, type_id_two)
    VALUES
    ('snorlax', 'snorlax', '/images/snorlax.png', 2, 5, 2, 1),
    ('pidgeot', 'pidgeot', '/images/pidgeot.png', 3, 1, 11, 2),
    ('togepi', 'togepi', '/images/togepi.png', 5, 6, 19, 1);
`;

async function main() {
    console.log('seeding...');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('done');
};

main();