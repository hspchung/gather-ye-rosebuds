//Socket connection
let socket = io('/write');
socket.on('connect', ()=>{
  console.log('Writing Client Connected');

  //Clear page with every new writing client joining
  //Ideally one writer and multiple painters
  let clear = {};
  socket.emit('clear-signal', clear);
  console.log('Clear signal sent');
})

//Retrieving data from JSON
window.addEventListener('load', function () {

  console.log('page has loaded');

  //Random selection of one of two different prompt sources
  let muses = ['Kanye', 'Shakespeare'];
  selectedMuse = muses[Math.floor(Math.random() * muses.length)];

  if (selectedMuse === 'Shakespeare') {
    // Shakespeare mode
    fetch('https://hspchung.github.io/gather-ye-rosebuds/shakespeare.json')
      .then(response => response.json())
      .then(data => {

        //Add random Shakespearean phrase above input box
        let randomPrompts = data.phrases;
        let projectDesc = document.querySelector('.muse');
        let projectPrompt = document.createElement('p');
        let projectMuse = document.createElement('p');
        projectPrompt.setAttribute('class', 'prompt');
        projectMuse.setAttribute('class', 'prompt');
        projectPrompt.innerHTML = '"' + randomPrompts[Math.floor(Math.random() * randomPrompts.length)] + '"';
        projectMuse.innerHTML = "Today's Muse: Shakespeare";
        projectDesc.prepend(projectPrompt);
        projectDesc.prepend(projectMuse);

      })
      .catch(error => {
        console.log(error);
      })
  } else {

    // Kanye Mode
    fetch('https://api.kanye.rest/')
      .then(response => response.json())
      .then(data => {

        //Add phrase above input box
        let randomPrompts = data.quote;
        let projectDesc = document.querySelector('.muse');
        let projectPrompt = document.createElement('p');
        let projectMuse = document.createElement('p');
        projectPrompt.setAttribute('class', 'prompt');
        projectMuse.setAttribute('class', 'prompt');
        projectPrompt.innerHTML = '"' + randomPrompts + '"';
        projectMuse.innerHTML = "Today's Muse: Kanye";
        projectDesc.prepend(projectPrompt);
        projectDesc.prepend(projectMuse);

      })

      .catch(error => {
        console.log(error);
      })
  }
})

//List of global variables
let canvas;
let bubbles = [];
let bubble;
let sect, line, submit, input, entry;
let outputCount = 0;
let selectedMuse;

//Rose variables
//Rose inspiration from Shu's Creative Sketch: https://editor.p5js.org/shuz/sketches/8uSUQRYW2
let G; // golden angle
let rose;
let newRosePos = true;
let roseX, roseY;

//Select HTML elements
sect = document.querySelector('.output');
input = document.querySelector('#poem');
submit = document.querySelector('.submitButton');
clearContent = document.querySelector('.clearButton');
entry = document.querySelector('#entry');

//Auto-select text box
input.focus();
input.select();

//Submit interaction on click
//For some reason, calling lineEntry() on click does not work, but rewriting the entire function does. Keeping redundancy here until further
submit.onclick = function(){
    //Non-empty write data sent
    if (outputCount < 5 && input.value != '') {
      outputCount++;
  
      //Send write data to server
      let entryData = {
        entry: input.value,
        muse: selectedMuse
      };
      socket.emit('write-data', entryData);
  
      input.value = '';
      //Send user back to text box
      input.focus();
      input.select();
    }
};

function lineEntry(){
  //Non-empty write data sent
  if (outputCount < 5 && input.value != '') {
    outputCount++;

    //Send write data to server
    let entryData = {
      entry: input.value,
      muse: selectedMuse
    };
    socket.emit('write-data', entryData);

    input.value = '';
    //Send user back to text box
    input.focus();
    input.select();
  }
}

socket.on('write-object', function (obj) {
  console.log('Writing object received');
  console.log(obj);
  writeEntry(obj);
});

function writeEntry(obj){
  //Change font based on Muse
  if (obj.muse === 'Shakespeare') {
    sect.setAttribute('id', 'shakespeare');
  } else if (obj.muse === 'Kanye') {
    sect.setAttribute('id', 'kanye');
  }

  let line = document.createElement('p');
  sect.appendChild(line);
  line.innerHTML = obj.entry;
  line.setAttribute('class', 'outputLine');
}

//Submit on "Enter"
//REF: https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
// Get the input field
// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    lineEntry();
  }
});

//Remove entries and clear page
//REF: https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
clearContent.onclick = function () {
  let clear = {};
  socket.emit('clear-signal', clear);
  console.log('Clear signal sent');
}

function clearPage(){
  console.log('Clear signal received');
  while (entry.firstChild) {
    entry.removeChild(entry.firstChild);
  }
  bubbles = [];
  outputCount = 0;
  background(250);
}

//p5 code
function setup() {
  //Canvas as background  
  push();
  canvas = createCanvas(windowWidth, windowHeight);
  translate(windowWidth / 2, windowHeight / 2);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  pop();
  background(250);

  //initialize Roses
  G = PI * (3 - sqrt(5));
  rose = new Rose(80, 80, 60 + random(0, 20));

  //Receive drawing data back from server and making bubbles with it
  socket.on('draw-object', function (obj) {
  console.log('Drawing object received');
  console.log(obj);
  bubbleMaker(obj);
  });
  
  //Receive drawing data back from server and making bubbles with it
  socket.on('rose-object', function (obj) {
  console.log('Rose object received');
  console.log(obj);
  roseMaker(obj);
  });

  //Clear page on signal reception
  socket.on('clear-object', ()=>{
    clearPage();
  });
}

function draw() {

  background(250, 15);

  //Rose calls
  rose.draw(roseX, roseY);
  rose.update();


  if (bubbles.length >= 0) {
    //Showing and moving bubbles
    for (let i = 0; i < bubbles.length; i++) {
      bubbles[i].show();
      bubbles[i].move();

      //Removing bubble condition
      if (bubbles[i].y >= windowHeight) {
        bubbles[i].expire();
      }
    }

    //Removing bubbles
    for (let i = bubbles.length - 1; i >= 0; i--) {
      if (bubbles[i].toDelete) {
        bubbles.splice(i, 1);
      }
    }
  }
}

//Canvas resizing on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//Making bubbles
function bubbleMaker(pos){
  let bubble = new Bubble(pos.x, pos.y, random(20, 50), random(255), random(255), random(255), random(255));
  bubbles.push(bubble);
}

//Rose maker
function roseMaker(pos){
  rose.reset();
  roseX = pos.x;
  roseY = pos.y;
}