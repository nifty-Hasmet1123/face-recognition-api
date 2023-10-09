import bcrypt from "bcrypt";
import { format } from "date-fns";

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

export function registerAPI(database, APP) {
    APP.post("/register", async (request, response) => {
        const { email, password } = request?.body;
        const currentDate = new Date();
        const formattedDate = format(currentDate, "MMMM dd, yyyy HH:mm:ss");
        const databaseCurrentLength = database.users.length;
        // using bcrypt for password encryption
        // condition block still pending if I will remove this
        // or not depending on the front-end
        if (!!email && !!password) {
            const hash = await bcrypt.hash(password, 10);
            let name = getNameThruUserEmail(email);
            
            const newData = {
                id: databaseCurrentLength + 1,
                name: name,
                email: email,
                password: password,
                entries: 0,
                joined: formattedDate
            };

            database.users.push(newData);
            database.login.push({
                email,
                hash
            });

            // don't put this on top it will have issue on reading this code
            const lastData = database.users.length - 1;
            const { id, entries, joined } = database.users[lastData];

            response.json({
                id,
                name,
                email,
                entries,
                joined
            });

        } else {
            // response.json({ "Error": "Input `id`, `name`, `email`, and `password`" });
            response.json({ "Error": "Input `username/email` & `password`" })
        };
    });
};