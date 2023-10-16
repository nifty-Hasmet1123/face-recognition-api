// create an instance of knex to connect your back-end to the database
import knex from "knex";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// es module pathing
const currentFileURL = new URL(import.meta.url);
const currentDir = path.dirname(fileURLToPath(currentFileURL));

const dbPath = path.join(currentDir, "../database/face-recognition.db");

const knexConfig = {
    client: "sqlite3",
    connection: {
        filename: dbPath        
    },

    useNullAsDefault: true,
};

const db = knex(knexConfig);
const app = express();
const PORT = 8001;

export { db, app, PORT };