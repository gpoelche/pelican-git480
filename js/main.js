// George Poelcher - GIT 480 - Pelican - Prof. Storm 

const fishMap = new Map(); //Map that holds all fish details from appData. Important for showing more details in the popup window.
const caughtFish = []; //Array that holds all of the users' currently caught fish by ID.
const allFishId = []; //Array that holds IDs of every fish. Used for resetting the cards shown in the DOM.

// SVGs that are used consistently for catch button visual status indicator. These are dynamically adjusted as the user toggles the catch status of each fish.
const xSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#e3e3e3"><path d="M6.4,19L5,17.6L10.6,12L5,6.4L6.4,5L12,10.6L17.6,5L19,6.4L13.4,12L19,17.6L17.6,19L12,13.4L6.4,19Z"/></svg>';
const checkSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#e3e3e3"><path d="M9.55,18l-5.7-5.7l1.43-1.42l4.28,4.28l9.18-9.18L20.15,7.4L9.55,18Z"/></svg>';

//Function for initializing the webapp on page open.
//Reads in user save data from localStorage and initializes Map data and loads all fish through loadCards.
async function goFish(){
    //Gathering all fish data from appData.json
    let data = await fetch("./assets/json/appData.json");
    let fishData = await data.json();

    //Now checks to see if fish is in localStorage before loading cards
    //loadCards now updates button text and applies special stylings through ternary conditionals
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
    if(localStorage.getItem("caughtFish")){
        caughtFish.length = 0;
        let temp = localStorage.getItem("caughtFish").split(",").map(Number);
        for(let f of temp){
            caughtFish.push(f);
        }

        console.log(caughtFish);
    }

    //Call loadCards with 
    loadCards(fishData);

    //Checks to see if the user has previously registered fish as caught in localStorage.
    //If so, data stored in localStorage are entered into the caughtFish array.
    //Values must be casted as Numbers with map() or the toggleCatch function will not work properly.

    //Update the fish count and set the total quantity of fish available.
    document.querySelector("#fishCount").textContent = caughtFish.length;
    document.querySelector("#fishTotal").textContent = fishMap.size;
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
                temp += createFishCard(id, fish);
            }   
        }

        //This executes when a 1D array is passed to the function. This is triggered when filter controls are reset.
        //This lets the user load all fish again without having to run goFish and make an async call to the appData file.
        else{
            for(let id of data){
                temp += createFishCard(id, fishMap.get(id));
            }
        }
    }

    //For the async JSON read data is passed at app launch, which allows the fishMap to be written.
    else{
        for(let card of data.fish){

            //Loading each fish into a card on the screen
            temp += createFishCard(card.id, card);

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

    //Assign event listeners to all of the toggleCatch and showDetail buttons.
    //These need attached every time this section is rerendered since the DOM is alread loaded.
    for(let button of document.querySelectorAll(".fish-card")){
        button.addEventListener("click", showFishDetails);
    }

    for(let button of document.querySelectorAll(".catch-button")){
        button.addEventListener("click", toggleCatchStatus);
    }
}

//A quick helper function that makes creating fish cards easier. I ended up making this because I was having trouble making changes to the fish cards since I do this in a few places.
function createFishCard(id, fish){
    let wasCaught = caughtFish.includes(id);

    // Setting a max length for the fish description shown on the fish-card preview. This is to keep global sizing expectations to create repeatable card sizings and stylings.
    let maxDesc = 50;
    let desc = fish.description;

    if(desc.length > maxDesc){
        desc = desc.slice(0,37).trim() + '...';
    }

    return `<section data-fish-id="${id}" class="fish-card${wasCaught ? " was-caught" : ""}"><div class="card-details"><img src="./assets/images/fish/${id}.png"><div><h3>${fish.name}</h3><p>${desc}</p></div></div><button class="catch-button">${wasCaught ? xSvg : checkSvg}</button></section>`;
}

// Shows all relevant details that are not initially shown in the pool of cards.
function showFishDetails(e){
    document.querySelector(".fish-popup").classList.remove("hidden");
    document.querySelector("#menuBlur").classList.remove("hidden");
    document.querySelector(".fish-popup button:last-of-type").innerHTML = checkSvg;
    
    //Uses the button to find the card the button was pressed in. Then uses the custom dataset attribute containing the fish ID for the map search.
    let id = Number(e.target.closest(".fish-card").dataset.fishId);
    document.querySelector(".fish-popup").dataset.fishId = id;
    let targetFish = fishMap.get(id);

    if(caughtFish.includes(id)){
        document.querySelector(".fish-popup button:last-of-type").innerHTML = xSvg;
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

    //If a fish is available all year, show "All Year" instead of all four seasons. Minimizes the content loaded in this window to prevent overflow.
    if(targetFish.season.length == 4){
        let temp = document.createElement("li");
        temp.textContent = "All Year";
        popupWindow.querySelector("#seasonList").appendChild(temp);
    }

    else{
        for(let season of targetFish.season){
            let temp = document.createElement("li");
            temp.textContent = season;
            popupWindow.querySelector("#seasonList").appendChild(temp);
        }
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
    //Since I've moved the listener for showFishDetails to attach to the parent card itself, the status toggle button was opening the popup window.
    //Using this built-in function to manually stop bubbling on the event listener, which fixes this issue.
    e.stopPropagation();

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
        e.target.closest(".fish-card").classList.toggle("was-caught");
    }

    //String that will hold the value put into the toggleStatus buttons
    let buttonIcon;

    //If fish is caught, remove from the caughtFish array and toggle status
    if(caughtFish.includes(id)){
            caughtFish.splice(caughtFish.indexOf(id), 1);
            buttonIcon = checkSvg;
    }

    //Fish is not caught, which is then set to caught and added to the caughtFish array
    else{
        caughtFish.push(id);
        buttonIcon = xSvg;
    }

    //Assign toggleStatus buttons with the assigned string value
    //Also updates toggleStatus button on fish card if the function is called from the fish popup window
    e.target.innerHTML = buttonIcon;
    if(e.target == document.querySelector(".fish-popup #popupStatus")){
        document.querySelector(`.fish-card[data-fish-id="${id}"] .catch-button`).innerHTML = buttonIcon;
    }

    //Sort the array to keep fish ID in numerical order. Likely not needed, but a preference.
    //Count is updated.
    caughtFish.sort();
    document.querySelector("#fishCount").textContent = caughtFish.length;

    let temp = caughtFish.toString();

    localStorage.setItem("caughtFish", temp);
    console.log(localStorage.getItem("caughtFish"));
}

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

    //Filter #2 - Location
    //Checks first to see if location is specified. There are three locations that have sub areas that are grouped together in filtered search.
    //If filter isn't set to one of those three, performs simple filter and returns.
    if(locationFilter != "all"){
        //Performs simple filter if not one of the three areas below
        if(locationFilter != "The Mines" && locationFilter != "Ginger Island" && locationFilter != "Sewer"){
            filterArray = filterArray.filter(([id, fish]) => fish.location.includes(locationFilter));
        }

        //These filters have sub-areas attached, which this switch case then handles the filtered search for.
        else{
            switch(locationFilter){
                case "The Mines":
                    filterArray = filterArray.filter(([id, fish]) => fish.location.includes("The Mines") || fish.location.includes("The Mines (Floor 20)") || fish.location.includes("The Mines (Floor 60)") || fish.location.includes("The Mines (Floor 100)"));
                    break;

                case "Sewer":
                    filterArray = filterArray.filter(([id, fish]) => fish.location.includes("Sewers") || fish.location.includes("Mutant Bug Lair"));
                    break;


                case "Ginger Island":
                    filterArray = filterArray.filter(([id, fish]) => fish.location.includes("Ginger Island (Ocean)") || fish.location.includes("Ginger Island (Volcano Caldera)") || fish.location.includes("Ginger Island (River)") || fish.location.includes("Ginger Island (Pirate Cove)"));
                    break;
                
                }  
        }
    }

    //Filter #3 - Season(s)
    //Begins simple filter search on array when the filter value isn't all
    //Filters for selected season.
    if(seasonFilter != "all"){
        filterArray = filterArray.filter(([id, fish]) => fish.season.includes(seasonFilter));
    }

    //Filter #4 - Weather
    //Begins simple filter search on array when the filter value isn't all
    //Filters for selected weather.
    if(weatherFilter != "all"){
        filterArray = filterArray.filter(([id, fish]) => fish.weather.includes(weatherFilter));
    }

    //Calls loadCards to reload the DOM with fish cards matching the filtered array ID values
    loadCards(filterArray);
}

//Allows the pop-up window to close when the close window button is clicked.
document.querySelector(".fish-popup button:first-of-type").addEventListener("click", function(){
    document.querySelector(".fish-popup").classList.add("hidden");
    document.querySelector("#menuBlur").classList.add("hidden");
});

document.querySelector("#popupStatus").addEventListener("click", toggleCatchStatus);
document.querySelector("#filters form").addEventListener("change", filteredSearch);

// Event listener that resets the filter forms and reloads all normal cards into the fish card pool.
document.querySelector("#resetButton").addEventListener("click", function(e){
    e.preventDefault();
    document.querySelector("form").reset();
    loadCards(allFishId);
});

//Wait for the DOM to load before performing goFish()
document.addEventListener("DOMContentLoaded", goFish);