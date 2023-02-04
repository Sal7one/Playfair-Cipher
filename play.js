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

let plainText = "hello"
let cipherText = ""
let key = "Ahmed"
let grid = null
let placeHolderLetter = "x"
let gridElm = document.querySelector("#grid");
let keyElm = document.querySelector("#key");
let plainTextElm = document.querySelector("#plain");
let cipherTextElm = document.querySelector("#cipher");
let playfairkeyInput = document.querySelector("#playfairkey")
let plainTextInput = document.querySelector("#plainText")

playfairkeyInput.addEventListener("input", rebuildUI)
plainTextInput.addEventListener("input", rebuildUI)
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

function getChuncksOfString(plainTextWithoutSpace){

let chunks = []

// Split into 2 pairs
for (var i = 0, charsLength = plainTextWithoutSpace.length; i < charsLength; i += 2) {
    chunks.push(plainTextWithoutSpace.substring(i, i + 2));
}

// If Last element is one letter add X to it
let lastChunck = chunks[chunks.length-1];
if(lastChunck.length == 1){
    chunks[chunks.length-1] = lastChunck + placeHolderLetter// usually "x"
}

// Check for double letter
console.log(chunks)

// Double letters to X
for (let index = 0; index < chunks.length; index++) {
    let letters = chunks[index];
    
    if(letters[0] == letters[1])
        chunks[index] = letters[0] + placeHolderLetter
    
}
console.log(chunks)

return chunks;
}

// Encrypt 
// Same row -> right 
// Same column -> down
// Digonale -> switch
function encrypt(plainText, grid){

let plainTextWithoutSpace = plainText.replaceAll(" ", "").toLowerCase()
let chunksOfWord = getChuncksOfString(plainTextWithoutSpace)
let cipherTextBuilder = ""

chunksOfWord.forEach(letterCombo => {
    let firstLetter = letterCombo[0]
    let secondLetter = letterCombo[1]

    // If hello => he lx ox
    if(firstLetter == secondLetter)
    secondLetter = placeHolderLetter// usually "x"

    let firstLetterRow = -1;
    let firstLetterColumn = -1;
    let secondLetterRow = -1;
    let secondLetterColumn = -1;

    for(let i =0; i< grid.length; i++){
        let row = grid[i]
        if(row.indexOf(firstLetter) != -1){
            firstLetterRow = i;
            firstLetterColumn = row.indexOf(firstLetter);
        }
        if(row.indexOf(secondLetter) != -1){
            secondLetterRow = i;
            secondLetterColumn = row.indexOf(secondLetter)
        }
    }

    // incremant by one and if needed overflow to 0 if max is reached (5) 
    if(firstLetterRow == secondLetterRow){
        if(++firstLetterColumn == 5){
            firstLetterColumn = 0;
        }
        
        if(++secondLetterColumn == 5){
            secondLetterColumn = 0;
        }
    }else if(firstLetterColumn == secondLetterColumn){

        if(++firstLetterRow == 5){
            firstLetterRow = 0;
        }
        
        if(++secondLetterRow == 5){
            secondLetterRow = 0;
        }
    }else{
        let temp =  firstLetterColumn
        firstLetterColumn = secondLetterColumn
        secondLetterColumn = temp
    }

    cipherTextBuilder += grid[firstLetterRow][firstLetterColumn] 
    cipherTextBuilder += grid[secondLetterRow][secondLetterColumn] 
});

return cipherTextBuilder;

}

function rebuildUI(){

    key = playfairkeyInput.value.replaceAll(" ", "").toLowerCase();
    plainText = plainTextInput.value.replaceAll(" ", "").toLowerCase();
// Generate grid
generateGrid(key)

if(plainText != ""){

keyElm.innerHTML = " " + key
plainTextElm.innerHTML = " " + plainTextInput.value

document.querySelector("#plainArray").innerHTML = "[   " + getChuncksOfString(plainText).join(",   ") + " ]"

cipherText = encrypt(plainText, grid)
cipherTextElm.innerHTML = " " + cipherText
document.querySelector("#cipherArray").innerHTML ="[   " + getChuncksOfString(cipherText).join(",  ") + " ]"
}

}

rebuildUI()