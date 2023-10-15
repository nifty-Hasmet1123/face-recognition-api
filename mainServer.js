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
import { format } from "date-fns";

// import { database } from "./database/db.js";
// import { signInPost } from "./restapi/signInAPI.js";
// import { registerAPI } from "./restapi/registerAPI.js";
// import { profileAPI } from "./restapi/profileAPI.js";
// import { imageAPI } from "./restapi/imageAPI.js";

// create an instance of knex to connect your back-end to the database
const knexConfig = {
    client: "sqlite3",
    connection: {
        filename: "./database/face-recognition.db"
    },

    useNullAsDefault: true,
};
// create instance of knex with config arguments
const db = knex(knexConfig);

// create an instance of express named `app` and create port number
const app = express();
const PORT = 8001;

// don't forget this to be able to parse 
// correctly the body for json
// apply cors() function. for front-end react to communicate with this server
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(cors());

function getNameThruUserEmail(emailParams) {
    let container = [];

    for (let letter of emailParams) {
        if (letter === "@") {
            break;
        }
        container.push(letter);
    }
    return container.join("");
};


async function runTestServer(PORT, APP) {
    // working
    APP.get("/", async (request, response) => {
        try {
            const data = await db.select("*").from("users");
            console.log(data);
            response.send(data)
        } catch (error) {
            console.log(error);
        };
    });

    // working but ID is null
    // need to create new db for this
    APP.post("/register", async (request, response) => {
        try {
            const currentDate = new Date();
            const formattedDate = format(currentDate, "MMMM dd, yyyy HH:mm:ss");
            const { id, email, entries } = request?.body;
            const name = getNameThruUserEmail(email);

            await db("users").insert({
                id,
                name,
                email,
                entries,
                joined: formattedDate
            });

            // Query the inserted data by the IDs
            const insertedData = await db.select("*").from("users").where({ id })
            console.log(insertedData);

            // show the response of the new inserted data
            response.status(201).json(insertedData);
        } catch (error) {
            console.error({"Error": error});
            response.status(500).json({ "Error": error.message });
        };
    });

    APP.delete("/remove/:id", async (request, response) => {
        // this is a column name within the db
        const id = request.params.id;

        try {
            // delete an entry based on id 
            const deletedEntry = await db("users").where({ id }).del();

            if (deletedEntry > 0) {
                // no-content response meaning the id entry is removed
                response.header("Deleted", `id entry: ${id}`);
                response.status(204).send(); 
            } else {
                response.status(404).json({ "Error": "Resource not found" });
            };
        } catch (error) {
            console.error({ "Errro": error });
            // Server error, return a 500 response.
            response.status(500).json({ "Error": error.message })
        };
    });
    
    APP.listen(PORT, () => {
        console.log(`Server running at port: http://localhost:${PORT}`);
    });
    
    // // sign-in post request
    // signInPost(database, APP);
    
    // // register post request
    // registerAPI(getDataUsers, APP);

    // // profileAPI
    // profileAPI(database, APP);

    // // imageAPI
    // imageAPI(database, APP);
   
    // listen port
    
};

runTestServer(PORT, app);
