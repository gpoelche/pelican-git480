// George Poelcher - GIT 480 - Pelican - Prof. Storm

//TO-DO: Will control the form operations and regex expressions for logging in and signing up.

if(document.querySelector("login-body")){
    console.log("In login");
}

if(document.querySelector(".signup-body")){
    document.querySelector("input[type^=submit]").addEventListener("click", function(e){
        e.preventDefault();
    });
}