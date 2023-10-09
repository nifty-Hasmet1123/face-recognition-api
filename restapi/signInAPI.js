// remember when a user is signing in you should always
// use `post` and not `get` to avoid query string information
// always use https

// use bcrypt for password encryption
import bcrypt from "bcrypt";

export function signInPost(database, APP) {
    APP.post("/signin", async (request, response) => {
        // check the users input
        const reqInputEmail = request?.body?.email;
        const reqInputPassword = request?.body?.password;
        
        if (!!reqInputEmail && !!reqInputPassword) {
            let userEmailInDatabase;
            let loginTarget;
            let targetIndex;

            // iterate over the database   
            // and if the data in the post found(the first occurence)
            // it will return true for both condition
            // it will be more good to have dataBase
            const findIfAvailableInDatabase = database.users.find((user, index) => {
                userEmailInDatabase = user.email;
                loginTarget = database.login[index];
                targetIndex = index;

                return user.email === reqInputEmail && user.password === reqInputPassword
            });

            // using bcrypt in signIn
            if (findIfAvailableInDatabase && !!userEmailInDatabase) {
                // const { id, name, email, entries, joined } = database.users[targetIndex];

                const logInHash = loginTarget.hash;
                // no need to use bcrypt.hash in here since it is already happening in registerAPI
                const isMatch = await bcrypt.compare(reqInputPassword, logInHash); // returns bool
                
                isMatch ? response.json(database.users[targetIndex]): 
                response.json({ "Error": "Does not match" })
            } else {
                response.status(400).json({ "Error": "Username and Password does not match" })
            };
            
        } else {
            response.status(400).json({ "Error": "Input an email and password" })
        };
    });
};
