// George Poelcher - GIT 480 - Pelican - Prof. Storm 

//Map for holding each of the fish once loaded into the DOM. This is much easier
//to work with for finding the key details shown in the pop-up window for each fish.
const fishMap = new Map();
const caughtFish = [];

// Function for loading all of the fish cards into the tracking pool from appData.json.
// Will be called every time the application is first loaded. This will need to also check localStorage for fish already caught.
async function loadFish(){
    let data = await fetch("./assets/json/appData.json");
    let fishData = await data.json();
    document.querySelector("#cardList").innerHTML = "";

    for(let card of fishData.fish){

        //Loading each fish into a card on the screen
        let tempCard = `<section data-fish-id="${card.id}" class="fish-card"><img src="./assets/images/fish/${card.id}.png"><div><h3>${card.name}</h3><p>${card.description}</p></div><div><button class="catch-button">Set to Caught</button><button class="detail-button">More Details</button></div></section>`;
        document.querySelector("#cardList").innerHTML += tempCard;

        //Mapping the indexes of the JSON to a Map, which will make searching for each fish much easier when needing to display fish cards.
        //Legendary fish have unique identifying fields, so these must be added in a seperate declaration from normal fish.
        if(card.legendary){
            fishMap.set(card.id, {name: card.name, description: card.description, location: card.location, time: card.time, season: card.season, weather: card.weather, difficulty: card.difficulty, legendary: card.legendary, legendNote: card.legendNote, requiredLevel: card.requiredLevel});
        }

        else{
            fishMap.set(card.id, {name: card.name, description: card.description, location: card.location, time: card.time, season: card.season, weather: card.weather, difficulty: card.difficulty});
        }
    }

    //Checks to see if the user has previously registered fish as caught in localStorage.
    //If so, data stored in localStorage are entered into the caughtFish array.
    //Values must be casted as Numbers with map() or the toggleCatch function will not work properly.
    if(localStorage.getItem("caughtFish")){
        caughtFish.length = 0;
        let temp = localStorage.getItem("caughtFish").split(",").map(Number);
        for(let f of temp){
            caughtFish.push(f);
        }

        //Setting proper labels for toggle buttons on fish stored in the user's local storage
        for(let id of caughtFish){
            document.querySelector('[data-fish-id="' + id + '"').querySelector(".catch-button").textContent = "Set to Uncaught";
        }
        
        //Update the fish count
        document.querySelector("#fishCount").textContent = caughtFish.length;
    }

    //Add event listener to buttons responsible for showing fish details.
    //These are added here since we're inserting these elements into the DOM after it's already loaded.
    for(let button of document.querySelectorAll(".detail-button")){
        button.addEventListener("click", showFishDetails);
    }

    for(let button of document.querySelectorAll(".catch-button")){
        button.addEventListener("click", toggleCatchStatus);
    }
}

// Shows all relevant details that are not initially shown in the pool of cards.
function showFishDetails(e){
    document.querySelector(".fish-popup").classList.remove("hidden");
    document.querySelector(".fish-popup button:last-of-type").textContent = "Set to Caught";
    
    //Uses the button to find the card the button was pressed in. Then uses the custom dataset attribute containing the fish ID for the map search.
    let id = Number(e.target.closest(".fish-card").dataset.fishId);
    document.querySelector(".fish-popup").dataset.fishId = id;
    let targetFish = fishMap.get(id);

    if(caughtFish.includes(id)){
        document.querySelector(".fish-popup button:last-of-type").textContent = "Set to Uncaught";
    }

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

//Function that toggles a fish's caught status. Status is toggled and the count for the user's caught fish total is updated.
function toggleCatchStatus(e){
    let id;

    //Fish ID is pulled differently depending on which container the event comes from.
    //Needs to distinguish where the event is from so that the proper query is performed to grab the ID in the fishId dataset.

    //When event is from the popup window
    if(e.target == document.querySelector(".fish-popup #popupStatus")){
        id = Number(e.target.closest(".fish-popup").dataset.fishId);
    }

    //When event is from the fish card in the fish pool
    else{
        id = Number(e.target.closest(".fish-card").dataset.fishId);
    }

    //String that will hold the value put into the toggleStatus buttons
    let buttonText = "";

    //If fish is caught, remove from the caughtFish array and toggle status
     if(caughtFish.includes(id)){
            caughtFish.splice(caughtFish.indexOf(id), 1);
            buttonText = "Set to Caught";
    }

    //Fish is not caught, which is then set to caught and added to the caughtFish array
    else{
        caughtFish.push(id);
        buttonText = "Set to Uncaught";
    }

    //Assign toggleStatus buttons with the assigned string value
    //Also updates toggleStatus button on fish card if the function is called from the fish popup window
    e.target.textContent = buttonText;
    if(e.target == document.querySelector(".fish-popup #popupStatus")){
            alert("TOGGLED FROM POPUP");
                document.querySelector(`.fish-card[data-fish-id="${id}"] .catch-button`).textContent = buttonText;
            }

    //Sort the array to keep fish ID in numerical order. Likely not needed, but a preference.
    //Count is updated.
    caughtFish.sort();
    document.querySelector("#fishCount").textContent = caughtFish.length;

    let temp = caughtFish.toString();

    localStorage.setItem("caughtFish", temp);
    console.log(localStorage.getItem("caughtFish"));
}

//Will be the function used to return a filtered set of fish on the DOM for the user.
//Will run every time the form is changed on the page.
function filteredSearch(e){
    // TEST STATEMENT
    console.log("FILTERED SEARCH :: WIP");

    //Start by collecting the values in the filter section fields
    //Values used to query the fish that meet the selected criteria
    let statusFilter = document.querySelector('input[name="caught"]:checked').value;
    let locationFilter = document.querySelector('select[name="location"]').value;
    let seasonFilter = document.querySelector('select[name="season"]').value;
    let weatherFilter = document.querySelector('select[name="weather"]').value;

    // TEST STATEMENT
    console.log(statusFilter + " " + locationFilter + " " + seasonFilter + " " + weatherFilter);
}

//Allows the pop-up window to close when the close window button is clicked.
document.querySelector(".fish-popup button:first-of-type").addEventListener("click", function(){
    document.querySelector(".fish-popup").classList.add("hidden");
});

document.querySelector("#popupStatus").addEventListener("click", toggleCatchStatus);
document.querySelector("#filters form").addEventListener("change", filteredSearch);

// Event listener that resets the filter forms and reloads all normal cards into the fish card pool.
document.querySelector("#resetButton").addEventListener("click", function(){
    document.querySelector("form").reset();
    loadFish();
});

//Wait for the DOM to load before performing loadFish()
document.addEventListener("DOMContentLoaded", loadFish);