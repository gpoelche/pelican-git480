// George Poelcher - GIT 480 - Pelican - Prof. Storm 

//Map for holding each of the fish once loaded into the DOM. This is much easier
//to work with for finding the key details shown in the pop-up window for each fish.
const fishMap = new Map();

// Function for loading all of the fish cards into the tracking pool from appData.json.
// Will be called every time the application is first loaded. This will need to also check localStorage for fish already caught.
async function loadFish(){
    console.log("This is a test function.");
    let data = await fetch("./assets/json/appData.json");
    let fishData = await data.json();

    for(let card of fishData.fish){
        //Storing temporary variables for each of the fish key details
        let nameString = card.name;
        let id = card.id;
        let descString = card.description;
        let locString = "";
        let weather = card.weather;
        let difficulty = card.difficulty;

        //Building the location(s) string, will likely be reworked
        for(let loc of card.location){
            locString += loc;
        }

        //Loading each fish into a card on the screen
        let tempCard = `<section class="fish-card"><img src="./assets/images/fish/${id}.png"><div><h3>${nameString}</h3><p>${descString}</p></div><div><button>Toggle Status</button><button class="detail-button">More Details</button><div class="id-div">${id}</div></div></section>`;
        document.querySelector("#cardList").innerHTML += tempCard;

        //Mapping the indexes of the JSON to a Map, which will make searching for each fish much easier when needing to display fish cards.
        fishMap.set(id, {name: nameString, description: descString, difficulty: difficulty});
    }

    //Add event listener to buttons responsible for showing fish details.
    //These are added here since we're inserting these elements into the DOM after it's already loaded.
    for(let button of document.querySelectorAll(".detail-button")){
        button.addEventListener("click", showFishDetails);
    }
}

loadFish();

// TO-DO: Write the function that creates the pop-up window showing the user more details of the fish they've selected.
// Shows all relevant details that are not initially shown in the pool of cards.
function showFishDetails(e){
    document.querySelector(".fish-popup").classList.remove("hidden");
    let id = e.target.nextSiblingElement.textContent;
    console.log(id);
}

//Allows the pop-up window to close when the close window button is clicked.
document.querySelector(".fish-popup button:first-of-type").addEventListener("click", function(){
    document.querySelector(".fish-popup").classList.add("hidden");
});