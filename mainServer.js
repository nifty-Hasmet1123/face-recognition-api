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

// const express = require("express");
import express from "express";
import cors from "cors";

import { database } from "./database/db.js";
import { signInPost } from "./restapi/signInAPI.js";
import { registerAPI } from "./restapi/registerAPI.js";
import { profileAPI } from "./restapi/profileAPI.js";
import { imageAPI } from "./restapi/imageAPI.js";

const app = express();
const PORT = 8001;

// don't forget this to be able to parse 
// correctly the body for json
// apply cors() function. for front-end react to communicate with this server

app.use(express.urlencoded({extended:true}));
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

runTestServer(PORT, app);
