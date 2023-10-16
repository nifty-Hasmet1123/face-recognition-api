import bcrypt from "bcrypt";

async function validator(email, password, db) {
    let passwordMatch;
    // return 1 matching array
    const emailValidator = await db.select("*").from("users").where({ email: `${email}` }); 

    if (emailValidator.length > 0) { // or use if (!!emailValidator)
        // returns 1 matching array
        const loginData = await db.select("hash").from("logins").where({ email: `${email}` }); 

        if (loginData.length > 0) {
            const hash = loginData[0].hash;
            passwordMatch = await bcrypt.compare(password, hash); 
        };
    };

    // returns if password match is true or false;
    return passwordMatch;  
};

export default validator;