// George Poelcher - GIT 480 - Pelican - Prof. Storm 

// Function for loading all of the fish cards into the tracking pool from appData.json.
// Will be called every time the application is first loaded. This will need to also check localStorage for fish already caught.
async function loadFish(){
    console.log("This is a test function.");
    let data = await fetch("./assets/json/appData.json");
    let fishData = await data.json();

    for(let card of fishData.fish){

        let nameString = card.name;
        let id = card.id;
        let descString = card.description;
        let locString = "";

        for(let loc of card.location){
            locString += loc;
        }

        let tempCard = `<section><h3>${nameString} [${id}]</h3><p>${descString}</p><p>Location(s): ${locString}</p><img src="./assets/images/fish/${id}.png"></section>`;
        document.querySelector("#cardList").innerHTML += tempCard;
    }
}

loadFish();

