/**
 * to do...
 * endpoints creation
 * --> / = this is working default endpoint
 * --> /signin route --> POST respond with either success or fail
 * --> /register route --> POST respond with user information(excluding password) object
 * --> /profile/:userId --> GET = user 
 * --> /image --> PUT --> user
 */

// package for bypassing `No Access-Control-Allow-Origin` in chrome
// you need to install cors library from this api folder

// package for connecting database to back-end using knex.js only works on node.js


// const express = require("express");
import express from "express";
import cors from "cors";
import knex from "knex";

import { database } from "./database/db.js";
import { signInPost } from "./restapi/signInAPI.js";
import { registerAPI } from "./restapi/registerAPI.js";
import { profileAPI } from "./restapi/profileAPI.js";
import { imageAPI } from "./restapi/imageAPI.js";

// create an instance of knex to connect your back-end to the database
const knexConfig = {
    client: "sqlite3",
    connection: {
        filename: "./database/face-recognition.db"
    },

    useNullAsDefault: true,
};

const db = knex(knexConfig);

async function getDataUsers() {
    try {
        const fetchData = await db.select("*").from("users");
        console.log(fetchData);
    } catch (error) {
        console.log({ "Error": error });
        throw error;
    };
};
getDataUsers();

// create an instance of express named `app` and create port number
const app = express();
const PORT = 8001;

// don't forget this to be able to parse 
// correctly the body for json
// apply cors() function. for front-end react to communicate with this server

app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(cors());

function runTestServer(PORT, APP) {
    APP.get("/", (request, response) => {
       response.send(database.users);
    });
    
    // sign-in post request
    signInPost(database, APP);
    
    // register post request
    registerAPI(database, APP);

    // profileAPI
    profileAPI(database, APP);

    // imageAPI
    imageAPI(database, APP);
   
    // listen port
    APP.listen(PORT, () => {
        console.log(`Server running at port: http://localhost:${PORT}`);
    });
};

// runTestServer(PORT, app);
