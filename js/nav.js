//A very simple script that handles mobile navigation display settings.

document.querySelector(".menu-toggle").addEventListener("click", function(){
    document.querySelector("nav").classList.add("show-menu")
});

document.querySelector("header .menu-close").addEventListener("click", function(){
    document.querySelector("nav").classList.remove("show-menu");
});

if(document.querySelector(".tracker-body")){{
    document.querySelector("#openFilters").addEventListener("click", function(e){
        e.preventDefault();
        document.querySelector("#filtersWrapper").classList.add("show-menu");
    });

    document.querySelector("#filtersWrapper .menu-close").addEventListener("click", function(e){
        e.preventDefault();
        document.querySelector("#filtersWrapper").classList.remove("show-menu");
    });
}}