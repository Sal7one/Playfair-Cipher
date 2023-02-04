const AplphaBetLetters = [
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


function generateGrid(key, plainText){

 let uniqueKeyArray = new Set()

 // Build unqiue matrix
 for(let i = 0; i< key.length; i++ )
    uniqueKeyArray.add(key[i].toLowerCase())

let uniqueMatrix = Array.from(new Set([...uniqueKeyArray, ...AplphaBetLetters]))

let splittedArray = []
while(uniqueMatrix.length) {
    splittedArray.push(uniqueMatrix.splice(0,5));
}

let allRows = ""
 // Build unqiue matrix
 for(i = 0; i < splittedArray.length; i++ ){
    allRows+= buildLetterRow(splittedArray[i])
 }

 console.log(splittedArray)


 document.querySelector("#output").innerHTML = allRows

}

function buildLetterRow(arrayOfLetters){

let letters = ""

arrayOfLetters.forEach(letter => {
    letters+=`<div class="letter" id="${letter}">${letter.toUpperCase()}</div>`
});

return `<div class="row">
   ${letters}
  </div>`
}

generateGrid("Saleha", "Hello")