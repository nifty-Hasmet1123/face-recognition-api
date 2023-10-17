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
// you need to install `cors` library from this api folder
// package for connecting database to back-end using knex.js only works on node.js

import { db, app, PORT } from "./config/config.js";
import { format } from "date-fns";
import bcrypt from "bcrypt";
import cors from "cors";
import express from "express";
import getNameThruUserEmail from "./functions/getName.js";
import validator from "./functions/async_validator.js";

// don't forget this to be able to parse. 
// correctly the body for json.
// apply cors() function. for front-end react to communicate with this server.
// these 3 codes are middleware to be used in connecting to the front end.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

async function runTestServer(PORT, APP) {
    // api endpoint
    APP.get("/api", async (request, response) => {
        try {
            const userTable = await db.select("*").from("users"); // returns an array
            const loginTable = await db.select("*").from("logins"); // returns an array
            // const allData = [...userTable, ...loginTable];

            response.status(200).send(userTable);
            console.log(loginTable);
        } catch (error) {
            console.log(error);
            response.status(500).json("Ooops something went wrong!");
        };
    });

    // signin endpoint
    APP.post("/signin", async (request, response) => {
        const reqInputEmail = request?.body?.email;
        const reqInputPassword = request?.body?.password;
        let isValid;
        
        if (!!reqInputEmail && !!reqInputPassword) {
            isValid = await validator(reqInputEmail, reqInputPassword, db); // returns boolean

            if (isValid) {
                const user = await db.select("id").from("users").where({ email: `${reqInputEmail}` });
                
                response.status(200).json({ "user_id": user[0].id, "valid": "success logging in." })
            } else {
                response.status(400).json({ "Error": "Invalid credentials" });
            };
        } else {
            response.status(400).json({ "Error": "Missing email or password" });
        };
    });

    // working register endpoint
    APP.post("/register", async (request, response) => {
        try {
            const currentDate = new Date();
            const formattedDate = format(currentDate, "MMMM dd, yyyy HH:mm:ss");
            const { email, password } = request?.body;

            if (!!email && !!password) {
                const hash = await bcrypt.hash(password, 10);
                await db("logins").insert({
                    email: email,
                    hash: hash
                });
            };

            const name = getNameThruUserEmail(email);
            
            await db("users").insert({
                name,
                email,
                joined: formattedDate
            });

            // use the db.raw method to get the last inserted id in the table
            const lastInsertedData = await db.raw("SELECT last_insert_rowid() as id");
            
            // Query the last inserted data by ID
            const insertedData = await db.select("*").from("users").where({ id: lastInsertedData[0].id })
            console.log(insertedData);

            // show the response of the new inserted data
            response.status(201).json(insertedData[0]);
        } catch (error) {
            console.error({"Error": error});
            response.status(500).json({ "Error": error.message });
        };
    });

    // profile endpoint
    APP.get("/profile/:id", async (request, response) => {
        const { id } = request?.params;
        
        try {
            // returns an array of object
            const userProfile = await db.select("*").from("users").where({ id });
            
            userProfile.length > 0 ? response.status(200).json(userProfile): 
            response.status(400).json({ "error": "user not found" });
            
        } catch (error) {
            response.status(500).json({ "Error made: ": error.message })
        };
    });

    // put endpoint
    APP.put("/image", async (request, response) => {
        const { id } = request?.body;
        // return an array of columns(key,value)
        try {
            const user = await db.select("*").from("users").where({ id: id });
            
            // increment entries
            const updateEntries = user[0].entries += 1;
            await db("users").where({ id }).update({ entries: updateEntries });

            response.status(200).json(user[0]);
        } catch (error) {
            response.status(500).json({ "error": "resource not found." })
        };
    });

    // delete endpoint
    APP.delete("/remove/:table/:id" , async (request, response) => {
        // note :table and :id should match tthe request.params to work
        const { table, id } = request?.params;
        let deletedEntry;
        
        try {
            if (table === "users") {
                deletedEntry = await db("users").where({ id }).del();    
            } else if (table === "logins") {
                deletedEntry = await db("logins").where({ id }).del();
            } else {
                response.status(404).json({ "Error": "Resource not found." });
                return; // stops the process if the tableName doesn't exist in db
            };

            if (deletedEntry > 0) {
                response.header("Deleted", `id entry: ${id} from table: ${table}`);
                response.status(204).send();
            } else {
                response.status(404).json({ "Error": "Resource not found." });
            }
        } catch (error) {
            console.error({ "Error": error });
            response.status(500).json({ "Error": error.message });
        };
    });

    APP.listen(PORT, () => {
        console.log(`Server running at port: http://localhost:${PORT}`);
    }); 
};

runTestServer(PORT, app);
