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
        let id = card.id;
        let nameString = card.name;
        let descString = card.description;
        let location = card.location;
        let time = card.time;
        let season = card.season;
        let weather = card.weather;
        let difficulty = card.difficulty;

        //Loading each fish into a card on the screen
        let tempCard = `<section class="fish-card"><img src="./assets/images/fish/${id}.png"><div><h3>${nameString}</h3><p>${descString}</p></div><div><button>Toggle Status</button><button class="detail-button">More Details</button><div class="id-div">${id}</div></div></section>`;
        document.querySelector("#cardList").innerHTML += tempCard;

        //Mapping the indexes of the JSON to a Map, which will make searching for each fish much easier when needing to display fish cards.
        fishMap.set(id, {name: nameString, description: descString, location: location, time: time, season: season, weather: weather, difficulty: difficulty});
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

    //Uses the button to find the card the button was pressed in.
    //querySelector is used to search for the div in that card containing the fish ID, which will be used for populating fish content in the card.
    let rootCard = e.target.closest(".fish-card");
    let id = Number(rootCard.querySelector(".id-div").textContent);

    let targetFish = fishMap.get(id);

    let popupWindow = document.querySelector(".fish-popup");
    popupWindow.querySelector("img").src = `assets/images/fish/${id}.png`;
    popupWindow.querySelector("h4").textContent = targetFish.name;
    popupWindow.querySelector("p").textContent = targetFish.description;

    popupWindow.querySelector("#locationList").innerHTML = "";
    for(let loc of targetFish.location){
        let temp = document.createElement("li");
        temp.textContent = loc;
        popupWindow.querySelector("#locationList").appendChild(temp);
    }

    popupWindow.querySelector("#timeList").innerHTML = "";
    for(let time of targetFish.time){
        let temp = document.createElement("li");
        temp.textContent = time;
        popupWindow.querySelector("#timeList").appendChild(temp);
    }

    popupWindow.querySelector("#seasonList").innerHTML = "";
    for(let season of targetFish.season){
        let temp = document.createElement("li");
        temp.textContent = season;
        popupWindow.querySelector("#seasonList").appendChild(temp);
    }

    popupWindow.querySelector("#weatherList").innerHTML = "";
    for(let weather of targetFish.weather){
        let temp = document.createElement("li");
        temp.textContent = weather;
        popupWindow.querySelector("#weatherList").appendChild(temp);
    }



}

//Allows the pop-up window to close when the close window button is clicked.
document.querySelector(".fish-popup button:first-of-type").addEventListener("click", function(){
    document.querySelector(".fish-popup").classList.add("hidden");
});