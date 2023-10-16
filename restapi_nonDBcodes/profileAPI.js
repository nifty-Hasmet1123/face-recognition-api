
export function profileAPI(database, APP) {
    APP.get("/profile/:id", (request, response) => {
        // request params http://localhost:8001/profile/<enter id> to search
        const { id } = request.params;

        const userProfile = database.users.find(user => {
            // turn the user.id to string for consistency
            return user.id.toString() === id;
        });

        if (userProfile) {
            // get the data - 1 of the database
            // remove password from display
            const { name, email, entries, joined } = database.users[Number(id) - 1];

            response.json({
                id,
                name,
                email,
                entries,
                joined
            });

            // response.json(database.users[Number(id) - 1])
        } else {
            response.status(404).json({ "Error": "No such ID" })
        };
    });
};