const ALPHABET = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
]

let plainText = "Some Text a"
let cipherText = ""
let key = "Ahmedo"
let grid = null
let gridElm = document.querySelector("#grid");
let keyElm = document.querySelector("#key");
let plainTextElm = document.querySelector("#plain");
let cipherTextElm = document.querySelector("#cipher");

function generateGrid(key) {

    let uniqueKeyArray = new Set()

    // Build unqiue matrix
    for (let i = 0; i < key.length; i++)
        uniqueKeyArray.add(key[i].toLowerCase())

    let uniqueMatrix = Array.from(new Set([...uniqueKeyArray, ...ALPHABET]))

    let splittedArray = []
    while (uniqueMatrix.length) {
        splittedArray.push(uniqueMatrix.splice(0, 5));
    }

    grid = splittedArray
    let allRows = ""
    // Build unqiue matrix
    for (i = 0; i < splittedArray.length; i++) {
        allRows += buildLetterRow(splittedArray[i])
    }

    gridElm.innerHTML = allRows
}

function buildLetterRow(arrayOfLetters) {
    let letters = ""
    arrayOfLetters.forEach(letter => {
        letters += `<div class="letter" id="${letter}">${letter.toUpperCase()}</div>`
    });

    return `<div class="row">
   ${letters}
  </div>`
}

function encrypt(plainText, grid){

let plainTextWithoutSpace = plainText.replaceAll(" ", "")
var chunks = [];
for (var i = 0, charsLength = plainTextWithoutSpace.length; i < charsLength; i += 2) {
    chunks.push(plainTextWithoutSpace.substring(i, i + 2));
}

let lastChunck = chunks[chunks.length-1];

console.log(plainTextWithoutSpace)
console.log(chunks)

}

// Generate grid
generateGrid(key)

// Key 
keyElm.innerHTML += " " + key
plainTextElm.innerHTML += " " + plainText


encrypt(plainText, grid)
cipherTextElm.innerHTML += " " + cipherText