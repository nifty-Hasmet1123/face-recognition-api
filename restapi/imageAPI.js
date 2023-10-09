export function imageAPI(database, APP) {
    APP.put("/image", (request, response) => {
        const { id } = request?.body;
        const dataBaseEntry = database.users[Number(id) - 1];

        const userProfile = database.users.find(user => {
            // make this into string for consistency
            return user.id.toString() === id.toString();
        });

        if (userProfile) {
            // increment the user database entries by 1
            dataBaseEntry.entries += 1;
            const { name, email, entries, joined } = dataBaseEntry;
            console.log(dataBaseEntry);

            response.json({
                id, 
                name,
                email,
                entries,
                joined
            });

        } else {
            response.status(404).json({ "Error": "No such ID" });
        };
    });
};