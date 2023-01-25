let bingo = document.getElementById("bingo");


async function bingoGenerator() {
    let bingocard = [];
    
    let bingotiles = await (await fetch('bingo/bingotiles.json')).json();
    for(let i = 0; i<25; i++ ){
        bingocard[i] = document.createElement("div");
        let tilenumber = getRandomInt(0, bingotiles.length);
        bingocard[i].innerHTML = await bingotiles[tilenumber];
        bingocard[i].className = "bingoTile";
        bingotiles.splice(tilenumber,1);
    }
    return bingocard;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


bingoGenerator()
    .then(things => things.map(thing => bingo.append(thing)));

  

