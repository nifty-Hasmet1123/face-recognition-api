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

export default getNameThruUserEmail;