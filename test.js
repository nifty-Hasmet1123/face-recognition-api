let string = "Hello@gmail.com";

let container = []
for (let letter of string) {
    if (letter === "@") {
        break;
    }
    container.push(letter);
    
}

console.log(container.join(""));

