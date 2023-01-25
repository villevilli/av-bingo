let bingoContainer = document.getElementById("bingo");
let bingoCard = []

async function main() {
    try{
        bingoCard = JSON.parse(localStorage.getItem("bingo"));
    }catch{
        bingoCard = await bingoGenerator();
    }

    bingoRender();
}

async function bingoGenerator() {
    let bingoCard = [];

    let bingotiles = await (await fetch('bingo/bingotiles.json')).json();
    for (let i = 0; i < 25; i++) {
        let tilenumber = getRandomInt(0, bingotiles.length);
        bingoCard[i] = {
            "element": document.createElement("div"),
            "text": await bingotiles[tilenumber],
            "ticked": false
        }
        bingoCard[i].element.className = "bingoTile";
        bingoCard[i].element.id = i;
        bingoCard[i].element.innerHTML = bingotiles[tilenumber];
        bingoCard[i].element.addEventListener("click", bingoClick)
        bingotiles.splice(tilenumber, 1);
    }
    return bingoCard;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function bingoClick(event) {
    let targetid = event.target.id;
    console.log(bingoCard[targetid].ticked)

    if (bingoCard[targetid].ticked == true) {
        bingoCard[targetid].element.classList.remove("ticked")
        bingoCard[targetid].ticked = false
    } else {
        bingoCard[targetid].element.classList.add("ticked")
        bingoCard[targetid].ticked = true
    }
    
    localStorage.setItem("bingo", JSON.stringify(bingoCard))
}

function bingoRender() {
    if (bingoContainer.firstChild != null) {
        for (let i = 0; i < bingoContainer.childNodes.length; i++) {
            bingoContainer[i].innerHtml = bingoCard[i].text;
        }
    }
    else {
        for (let i = 0; i < 25; i++) {
            bingoContainer.appendChild(bingoCard[i].element)
        }
    }
}

main();