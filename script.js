const scoreBoard = document.querySelector('.score');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const game = document.getElementById("game");
let score = 0;
let lastHole; //avoid mole in same hole consecutively
let timeUp = false;
let images = ['images/hiro.png', 'images/astrid.png', 'images/baymax.png', 'images/hiccup.png', 'images/toothless.png'];

//Modal
let modal = document.getElementById("rulesModal");
let modalBtn = document.getElementById("modalBtn");
let closeBtn = document.getElementById("closeBtn");

modalBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

  //start game
  function startGame() {
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    peep();

    setTimeout(() => timeUp = true, 20000);
  }

//gives random amount of time between a min and max
function randomTime(min, max) {
    return Math.round(Math.random() * (max-min) + min);
}

  //pick a random hole for the mole to pop up from
  function randomHole(holes) {
    //get a random DOM element function
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if(hole == lastHole) {
      return randomHole(holes); //run func again to get a diff hole
    }
    lastHole = hole;
    return hole;
  }

  //bonk and peep

  function peep() {
    const time = randomTime(800,1500);
    const hole = randomHole(holes);
    const image = Math.floor(Math.random()*images.length);
    const imageURL = images[image];
    let allMoles = document.getElementsByClassName("mole");
    for (let i = 0; i < allMoles.length; i++){
      allMoles[i].style.backgroundImage = `url('${imageURL}')`;
    };
    hole.classList.add('up');
    setTimeout(() => {
      hole.classList.remove('up');
      if(!timeUp) peep();
    }, time);
  }

  function bonk(e) {
    if(!e.isTrusted) return;
    this.classList.remove('up');
    setTimeout(() => {
      game.style.cursor = "url('images/mallet.png'), auto";
    }, 100)
    game.style.cursor = "url('images/mallet-hit.png'), auto";
    /*would be nice if can access image url from e 
    instead of checking current bg image because
    it changes too fast for the audio to respond*/
    let img = getImage();
    bonkAudio();
    switch(img) {
      case "Hiro":
        score += 200;
        playSound("Hiro");
        break;
      case "Baymax":
        score -= 400;
        playSound("Baymax");
        break;
      case "Astrid":
        score += 300;
        playSound("Astrid");
        break;
      case "Hiccup":
        score += 250;
        playSound("Hiccup");
        break;
      case "Toothless":
        score -= 500;
        playSound("Toothless");
        break;
    }
    scoreBoard.textContent = score;
  }

  moles.forEach(mole => mole.addEventListener('click', bonk));

  //get current image
  function getImage() {
    let currentImg = document.getElementsByClassName('mole')[1].style.backgroundImage;
    currentImg = currentImg.slice(4, -1).replace(/"/g, "");
    switch(currentImg) {
      case "images/hiro.png":
        return "Hiro";
        break;
      case "images/baymax.png":
        return "Baymax";
        break;
      case "images/astrid.png":
        return "Astrid";
        break;
      case "images/hiccup.png":
        return "Hiccup";
        break;
      case "images/toothless.png":
        return "Toothless";
        break;
    }
  }

  //play bonk
  function bonkAudio() {
    let bonkAudio = document.querySelector(`audio[id="bonk"]`);
    if(!bonkAudio) return;
  
    bonkAudio.play();
  }

  //play sounds
  function playSound(identifier) {
    let audio = document.querySelector(`audio[id="${identifier}"]`);
    if(!audio) return;

    audio.currentTime = 0;
    audio.play();
  }