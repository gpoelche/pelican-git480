// George Poelcher - GIT 480 - Pelican - Prof. Storm 

const fishMap = new Map(); //Map that holds all fish details from appData. Important for showing more details in the popup window.
const caughtFish = []; //Array that holds all of the users' currently caught fish by ID.
const allFishId = []; //Array that holds IDs of every fish. Used for resetting the cards shown in the DOM.

//Function for initializing the webapp on page open.
//Reads in user save data from localStorage and initializes Map data and loads all fish through loadCards.
async function goFish(){
    //Gathering all fish data from appData.json
    let data = await fetch("./assets/json/appData.json");
    let fishData = await data.json();

    //Call loadCards with 
    loadCards(fishData);

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
            document.querySelector('[data-fish-id="' + id + '"]').querySelector(".catch-button").textContent = "Set to Uncaught";
        }
        
        //Update the fish count and set the total quantity of fish available.
        document.querySelector("#fishCount").textContent = caughtFish.length;
        document.querySelector("#fishTotal").textContent = fishMap.size;
    }
}

//Function that receives a datatype to load fish cards from
//Performs loading differently depending on the datatype received.
function loadCards(data){
    
    document.querySelector("#cardList").innerHTML = "";
    let temp = "";

    //Check to see if data is an array, which is passed from filteredSearch()
    //This accounts for both resetting the filter form and triggering any chance to the filter form
    if(Array.isArray(data)){

        //The array passed from the filteredSearch function is 2D, so we need to check and see if it is 2D or not.
        //This is done by checking to see if the first index at data is an array or not.
        if(Array.isArray(data[0])){
            for(let [id, fish] of data){
                temp += `<section data-fish-id="${id}" class="fish-card"><img src="./assets/images/fish/${id}.png"><div><h3>${fish.name}</h3><p>${fish.description}</p></div><div><button class="catch-button">Set to Caught</button><button class="detail-button">More Details</button></div></section>`;
            }   
        }

        //This executes when a 1D array is passed to the function. This is triggered when filter controls are reset.
        //This lets the user load all fish again without having to run goFish and make an async call to the appData file.
        else{
            for(let id of data){
                temp += `<section data-fish-id="${id}" class="fish-card"><img src="./assets/images/fish/${id}.png"><div><h3>${fishMap.get(id).name}</h3><p>${fishMap.get(id).description}</p></div><div><button class="catch-button">Set to Caught</button><button class="detail-button">More Details</button></div></section>`;
            }
        }
    }

    //For the async JSON read data is passed at app launch, which allows the fishMap to be written.
    else{
        for(let card of data.fish){

            //Loading each fish into a card on the screen
            temp += `<section data-fish-id="${card.id}" class="fish-card"><img src="./assets/images/fish/${card.id}.png"><div><h3>${card.name}</h3><p>${card.description}</p></div><div><button class="catch-button">Set to Caught</button><button class="detail-button">More Details</button></div></section>`;

            //Mapping the indexes of the JSON to a Map, which will make searching for each fish much easier when needing to display fish cards.
            //Legendary fish have unique identifying fields, so these must be added in a seperate declaration from normal fish.
            if(card.legendary){
                fishMap.set(card.id, {name: card.name, description: card.description, location: card.location, time: card.time, season: card.season, weather: card.weather, difficulty: card.difficulty, legendary: card.legendary, legendNote: card.legendNote, requiredLevel: card.requiredLevel});
            }

            else{
                fishMap.set(card.id, {name: card.name, description: card.description, location: card.location, time: card.time, season: card.season, weather: card.weather, difficulty: card.difficulty});
            }

            allFishId.push(card.id);
        }
    }

    //Removing any elements that may be in this area of the DOM.
    document.querySelector("#cardList").innerHTML += temp;

    //Sets the proper labels for caught toggle button status on fish cards
    //Needs to check if the element exists before attempting since this operation will only work if showing all or only caught fish
    //Will throw a type error when performing the textContent adjustment on an item that doesn't exist in DOM.
    for(let id of caughtFish){
            if(document.querySelector('[data-fish-id="' + id + '"]') != null){
                document.querySelector('[data-fish-id="' + id + '"]').querySelector(".catch-button").textContent = "Set to Uncaught";
            }
        }

    //Assign event listeners to all of the toggleCatch and showDetail buttons.
    //These need attached every time this section is rerendered since the DOM is alread loaded.
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

//TO-DO: Add location filtering
//Function that updates DOM to show filtered fish in the card pool.
//Updates on change to the form.
function filteredSearch(e){
    //Start by collecting the values in the filter section fields
    //Values used to query the fish that meet the selected criteria
    let statusFilter = document.querySelector('input[name="caught"]:checked').value;
    let locationFilter = document.querySelector('select[name="location"]').value;
    let seasonFilter = document.querySelector('select[name="season"]').value;
    let weatherFilter = document.querySelector('select[name="weather"]').value;

    //Converting the fishMap to an array so that filter functions can be used.
    //This makes searching based on certain conditions much easier.
    let filterArray = Array.from(fishMap);

    //Filter #1 - Catch Status
    //If yes, then checks to see if its caught or uncaught. Checks against caughtFish depending on answer.
    //If no filter is placed, the loop breaks and all fish are considered for the filtered list.
    switch(statusFilter){
        case "caughtOnly":
            filterArray = filterArray.filter(([id, fish]) => caughtFish.includes(id));
            break;

        case "uncaughtOnly":
            filterArray = filterArray.filter(([id, fish]) => !caughtFish.includes(id));
            break;

        default:
            break;
    }

    //Filter #2 - Location :: TO-DO
    //Location data must be normalized and the appData file must be finalized first.
    //Need to find a way to organize locations that makes sense despite the various locations each fish has.

    //Filter #3 - Season(s)
    //Checks for specific season cases to filter fish out from the array.
    //If no season is applied, no filter is placed and this case loop breaks.
    switch(seasonFilter){
        case "Spring":
            filterArray = filterArray.filter(([id, fish]) => fish.season.includes("Spring"));
            break;

        case "Summer":
            filterArray = filterArray.filter(([id, fish]) => fish.season.includes("Summer"));
            break;

        case "Fall":
            filterArray = filterArray.filter(([id, fish]) => fish.season.includes("Fall"));
            break;

        case "Winter":
            filterArray = filterArray.filter(([id, fish]) => fish.season.includes("Winter"));
            break;
        
        default:
            break;
    }

    //Filter #4 - Weather
    //Checks to see if fish are caught in specific conditions.
    //This also includes fish that are caught in any condition since any is separate from sunny or rainy but applies also to both.
    //A fish with any only holds that value, which technically satisfies both rainy and sunny.
    switch(weatherFilter){
        case "Sunny":
            filterArray = filterArray.filter(([id, fish]) => fish.weather.includes("Sunny") || fish.weather.includes("Any"));
            break;

        case "Rainy":
            filterArray = filterArray.filter(([id, fish]) => fish.weather.includes("Rainy") || fish.weather.includes("Any"));
            break;

        default:
            break;
    }

    //Calls loadCards with an array of IDs that match the search conditions of the applied filters
    //loadCards displays the filtered fish to the DOM.
    loadCards(filterArray);
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
    loadCards(allFishId);
});

//Wait for the DOM to load before performing goFish()
document.addEventListener("DOMContentLoaded", goFish);