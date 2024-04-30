let bingoContainer = document.getElementById("bingo");
let resetButton = document.getElementById("resetButton");

let bingoSessionData = []
let bingoElements = []

const avBingo = "bingo/avBingoTiles.json";
const kaivariBingo = "bingo/kaivariBingoTiles.json"

const bingoSelector = document.getElementById("bingo_selector");

async function main() {
    try {
        bingoSessionData = JSON.parse(localStorage.getItem("bingo"));
        if (bingoSessionData == null) {
            throw new Error("Storage is empty!")
        }
        for (let i = 0; i < 25; i++) {
            populateElement(i, bingoSessionData[i].text, bingoSessionData[i].ticked)
        }
    } catch {
        bingoSessionData = await bingoGenerator();
    }

    resetButton.addEventListener("click", resetBingo)

    bingoRender();
}

function resetBingo(event) {
    localStorage.removeItem("bingo");
    location.reload();
}

function populateElement(id, title, ticked) {
    bingoElements[id] = document.createElement("div");
    bingoElements[id].className = "bingoTile";
    bingoElements[id].id = id;
    bingoElements[id].textContent = title;
    bingoElements[id].addEventListener("click", bingoClick);
    if (ticked) {
        bingoElements[id].classList.add("ticked");
    }
}

async function getBingoJson() {
    let url;

    switch (bingoSelector.selectedOptions[0].value) {
        case ("av-bingo"):
            url = "bingo/avBingoTiles.json"
            break;
        case ("kaivari-bingo"):
            url = "bingo/kaivariBingoTiles.json"
            break;
    }

    return fetch(url).then((result) => result.json());
}

async function bingoGenerator() {
    let bingoCard = [];
    let bingoElements = []

    let bingotiles = await getBingoJson();
    for (let i = 0; i < 25; i++) {
        let tilenumber = getRandomInt(0, bingotiles.length);
        bingoCard[i] = {
            "text": await bingotiles[tilenumber],
            "ticked": false
        }
        populateElement(i, bingotiles[tilenumber], false);
        bingotiles.splice(tilenumber, 1);
    }
    return bingoCard
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function bingoClick(event) {
    let targetid = event.target.id;

    if (bingoSessionData[targetid].ticked == true) {
        bingoElements[targetid].classList.remove("ticked")
        bingoSessionData[targetid].ticked = false
    } else {
        bingoElements[targetid].classList.add("ticked")
        bingoSessionData[targetid].ticked = true
    }

    localStorage.setItem("bingo", JSON.stringify(bingoSessionData))
}

function bingoRender() {
    if (bingoContainer.firstChild != null) {
        for (let i = 0; i < bingoContainer.childNodes.length; i++) {
            bingoContainer[i].innerHtml = bingoSessionData[i].text;
        }
    }
    else {
        for (let i = 0; i < 25; i++) {
            bingoContainer.appendChild(bingoElements[i])
        }
    }
}

main();