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

        let tempCard = `<section class="fish-card"><img src="./assets/images/fish/${id}.png"><div><h3>${nameString} [${id}]</h3><p>${descString}</p></div><div><button>Toggle Status</button><button>More Details</button></div></section>`;
        document.querySelector("#cardList").innerHTML += tempCard;
    }
}

// TO-DO: Write the function that creates the pop-up window showing the user more details of the fish they've selected.
// Shows all relevant details that are not initially shown in the pool of cards.
function showFishDetails(){
    true;
};

loadFish();

