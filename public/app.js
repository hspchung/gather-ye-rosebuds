let paintButton = document.querySelector('#paintButton');
let writeButton = document.querySelector('#writeButton');

var currentLocation = window.location.href;

//Redirect to different namespaces depending upon button pressed
paintButton.onclick = function (){
    window.location.replace(currentLocation + "/draw");
}

writeButton.onclick = function (){
    window.location.replace(currentLocation + "/write");
}