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

//Submit click
submit.addEventListener('click', function lineEntry() {

  //Changes output font based on Muse
  if (selectedMuse === 'Shakespeare') {
    sect.setAttribute('id', 'shakespeare');
  } else if (selectedMuse === 'Kanye') {
    sect.setAttribute('id', 'kanye');
  }
  //Max output count
  if (outputCount < 5 && input.value != '') {

    line = document.createElement('p');
    sect.appendChild(line);
    line.innerHTML = input.value;
    line.setAttribute('class', 'outputLine');
    input.value = '';
    outputCount++;

    //Send user back to text box
    input.focus();
    input.select();
  } else {
    submit.disabled;
  }
}
)

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
    submit.click();
  }
});

//Remove entries and clear page
//REF: https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
clearContent.onclick = function () {
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

function mouseClicked() {
  rose.reset();
  roseX = mouseX;
  roseY = mouseY;
}

function mouseDragged() {
  //Making bubbles
  let bubble = new Bubble(mouseX, mouseY, random(20, 50), random(255), random(255), random(255), random(255));
  bubbles.push(bubble);
}

//Canvas resizing on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
