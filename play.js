const alphabet = [
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
let chiperPlainInput = document.querySelector("#chiperPlain")
let encButton = document.querySelector("#encrypt")
let decButton = document.querySelector("#decrypt")

playfairkeyInput.addEventListener("input", rebuildUI)
chiperPlainInput.addEventListener("input", rebuildUI)
encButton.addEventListener("input", rebuildUI)
decButton.addEventListener("input", rebuildUI)

function generateGrid(key) {

    let uniqueKeyArray = new Set()

    // Build unqiue matrix
    for (let i = 0; i < key.length; i++)
        uniqueKeyArray.add(key[i].toLowerCase())

    let uniqueMatrix = Array.from(new Set([...uniqueKeyArray, ...alphabet]))

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

function getChuncksOfString(plainTextWithoutSpace) {

    let ptws = ""

    for (let k = 0; k < plainTextWithoutSpace.length; k++) {
        const currentLetter = plainTextWithoutSpace[k];
        if (k + 1 != plainTextWithoutSpace.length) {
            let nextLetter = plainTextWithoutSpace[k + 1]
            if (currentLetter == nextLetter) {
                ptws += currentLetter + placeHolderLetter
            } else {
                ptws += currentLetter + nextLetter
                k++
            }
        } else {
            // Last Letter
            ptws += currentLetter
        }
    }

    let chunks = []

    // Split into 2 pairs
    for (var i = 0, charsLength = ptws.length; i < charsLength; i += 2) {
        chunks.push(ptws.substring(i, i + 2));
    }

    // If Last element is one letter add X to it
    let lastChunck = chunks[chunks.length - 1];
    if (lastChunck.length == 1) {
        chunks[chunks.length - 1] = lastChunck + placeHolderLetter // usually "x"
    }

    return chunks;
}

// Encrypt 
// Same row -> right 
// Same column -> down
// Digonale -> switch
function encrypt(plainText, grid) {

    let plainTextWithoutSpace = plainText.replaceAll(" ", "").toLowerCase()
    let chunksOfWord = getChuncksOfString(plainTextWithoutSpace)
    let cipherTextBuilder = ""

    chunksOfWord.forEach(letterCombo => {
        let firstLetter = letterCombo[0]
        let secondLetter = letterCombo[1]

        let firstLetterRow = -1;
        let firstLetterColumn = -1;
        let secondLetterRow = -1;
        let secondLetterColumn = -1;

        for (let i = 0; i < grid.length; i++) {
            let row = grid[i]
            if (row.indexOf(firstLetter) != -1) {
                firstLetterRow = i;
                firstLetterColumn = row.indexOf(firstLetter);
            }
            if (row.indexOf(secondLetter) != -1) {
                secondLetterRow = i;
                secondLetterColumn = row.indexOf(secondLetter)
            }
        }

        // incremant by one and if needed overflow to 0 if max is reached (5) 
        if (firstLetterRow == secondLetterRow) {
            if (++firstLetterColumn == 5) {
                firstLetterColumn = 0;
            }

            if (++secondLetterColumn == 5) {
                secondLetterColumn = 0;
            }
        } else if (firstLetterColumn == secondLetterColumn) {

            if (++firstLetterRow == 5) {
                firstLetterRow = 0;
            }

            if (++secondLetterRow == 5) {
                secondLetterRow = 0;
            }
        } else {
            let temp = firstLetterColumn
            firstLetterColumn = secondLetterColumn
            secondLetterColumn = temp
        }

        cipherTextBuilder += grid[firstLetterRow][firstLetterColumn]
        cipherTextBuilder += grid[secondLetterRow][secondLetterColumn]
    });

    return cipherTextBuilder;

}

function rebuildUI() {

    key = playfairkeyInput.value.replaceAll(" ", "").toLowerCase();
    let chiperPlain = chiperPlainInput.value.replaceAll(" ", "").toLowerCase();
    let label = document.querySelector("#typeOfText");

    // Generate grid
    generateGrid(key)

    if (chiperPlain != "") {
        keyElm.innerHTML = "Key: " + `<span class="actualvalue"> ${playfairkeyInput.value} </span>`

        if (encButton.checked) {
            label.innerHTML = "Plain Text"
            plainTextElm.innerHTML = "Plain Text: " + `<span class="actualvalue"> ${chiperPlainInput.value} </span>`
            document.querySelector("#plainArray").innerHTML = `<span class="actualvalue"> ${"[   " + getChuncksOfString(chiperPlain).join(",   ") + " ]"} </span>`
            cipherText = encrypt(chiperPlain, grid)
            cipherTextElm.innerHTML = "Cipher Text: " + `<span class="actualvalue"> ${cipherText.toUpperCase()} </span>`
            document.querySelector("#cipherArray").innerHTML = `<span class="actualvalue"> ${"[   " + getChuncksOfString(cipherText).join(",   ") + " ]"} </span>`
        } else if (decButton.checked) {
            label.innerHTML = "Cipher Text"

            plainTextElm.innerHTML = "Cipher Text: " + `<span class="actualvalue"> ${chiperPlainInput.value} </span>`
            document.querySelector("#plainArray").innerHTML = ``
            cipherText = decrypt(chiperPlain, grid)
            cipherTextElm.innerHTML = "Plain Text: " + `<span class="actualvalue"> ${cipherText.toUpperCase()} </span>`
            document.querySelector("#cipherArray").innerHTML = ``

        }

    }
}

function decrypt(cipherText, grid) {

    let cipherTextWithoutSpace = cipherText.replaceAll(" ", "").toLowerCase()
    let chunks = []

    // Split into 2 pairs
    for (var i = 0, charsLength = cipherTextWithoutSpace.length; i < charsLength; i += 2) {
        chunks.push(cipherTextWithoutSpace.substring(i, i + 2));
    }

    let PlainTextBuilder = ""

    chunks.forEach(letterCombo => {
        let firstLetter = letterCombo[0]
        let secondLetter = letterCombo[1]

        let firstLetterRow = 0;
        let firstLetterColumn = 0;
        let secondLetterRow = 0;
        let secondLetterColumn = 0;

        for (let i = 0; i < grid.length; i++) {
            let row = grid[i]
            if (row.indexOf(firstLetter) != -1) {
                firstLetterRow = i;
                firstLetterColumn = row.indexOf(firstLetter);
            }
            if (row.indexOf(secondLetter) != -1) {
                secondLetterRow = i;
                secondLetterColumn = row.indexOf(secondLetter)
            }
        }

        if (firstLetterRow == secondLetterRow) {
            if (--firstLetterColumn == -1) {
                firstLetterColumn = 5;
            }

            if (--secondLetterColumn == -1) {
                secondLetterColumn = 5;
            }
        } else if (firstLetterColumn == secondLetterColumn) {

            if (--firstLetterRow == -1) {
                firstLetterRow = 5;
            }

            if (--secondLetterRow == -1) {
                secondLetterRow = 5;
            }
        } else {
            let temp = firstLetterColumn
            firstLetterColumn = secondLetterColumn
            secondLetterColumn = temp
        }
        PlainTextBuilder += grid[firstLetterRow][firstLetterColumn]
        PlainTextBuilder += grid[secondLetterRow][secondLetterColumn]
    });

    return PlainTextBuilder;
}
rebuildUI()