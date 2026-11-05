//A very simple script that handles mobile navigation display settings.

document.querySelector(".menu-toggle").addEventListener("click", function(){
    document.querySelector("nav").classList.add("show-menu")
});

document.querySelector(".menu-close").addEventListener("click", function(){
    document.querySelector("nav").classList.remove("show-menu");
});