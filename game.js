/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;
let userName = document.getElementById("userName");

let startTime = Date.now();
// 10. I have 15 seconds to catch as many monsters as I can.
const SECONDS_PER_ROUND = 15;

let elapsedTime = 0;
let score = 0;

const applicationState = {
  gameStart: false,
  user: "",
  bestScore: {
    user: "",
    score: 0,
    date: ""
  },
  history: []
};
function loadImages() {
  bgImage = new Image();
  bgImage.onload = function() {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.png";
  heroImage = new Image();
  heroImage.onload = function() {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
}

/**
 * Setting up our characters.
 *
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 *
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = 100;
let monsterY = 100;

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  addEventListener(
    "keydown",
    function(key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function(key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}

// 8. [ ] As a player, I can see an input.
// 9. [ ] As a player, I can put my name into the input and then submit it to see my name on the screen
function getName() {
  applicationState.user = userName.value;
  document.getElementById(
    "userinfo"
  ).innerHTML = `welcome ${applicationState.user}`;
  applicationState.gameStart = true;
  startTime = Date.now();
}

// 13. if the timer runs out I can press the reset button and start the game over.
function resetGame() {
  elapsedTime = 0;
  score = 0;
  userName.innerHTML = ``;
  console.log("resetGame");
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function() {
  // 11.if the timer runs out I cannot move my hero anymore.
  if (applicationState.gameStart == false) {
    return;
  }

  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  if (SECONDS_PER_ROUND - elapsedTime == 0) {
    applicationState.gameStart = false;

    //12. if the timer runs out I can see a reset button.
    document.getElementById("resetButton").style.visibility = "visible";

    //14. if my score is higher than the previous high score then my score replaces it.
    if (applicationState.bestScore.score < score) {
      applicationState.bestScore.score = score;
      document.getElementById(
        "bestScoreArea"
      ).innerHTML = `Best Score: ${applicationState.bestScore.score}`;
    }
    //15. I can see the history of last scores.
    obj = { user: applicationState.user, score: score, date: Date.now() };
    applicationState.history.push(obj);
    let htmlHistory = applicationState.history.map(
      i => `<p>${i.user},${i.score},${i.date}`
    );
    document.getElementById("historyArea").innerHTML = `History ${htmlHistory}`;

    localStorage.setItem("monsterchasing1", JSON.stringify(applicationState));
  }

  if (38 in keysDown) {
    // Player is holding up key
    heroY -= 5;
  }
  if (40 in keysDown) {
    // Player is holding down key
    heroY += 5;
  }
  if (37 in keysDown) {
    // Player is holding left key
    heroX -= 5;
  }
  if (39 in keysDown) {
    // Player is holding right key
    heroX += 5;
  }

  // 2. if I move the hero off the canvas to the right, the hero appears on the left.
  if (heroX >= canvas.width - 32) {
    heroX = 32;
  }
  //3.  if I move the hero off the canvas to the left, the hero appears on the right.
  else if (heroX <= 0) {
    heroX = canvas.width - 32;
  }
  // 4. if I move the hero off the canvas to the top, the hero appears on the bottom.
  if (heroY >= canvas.height - 32) {
    heroY = 32;
  }
  // 5. if I move the hero off the canvas to the bottom, the hero appears on the top.
  else if (heroY <= 0) {
    heroY = canvas.height - 32;
  }

  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= monsterX + 32 &&
    monsterX <= heroX + 32 &&
    heroY <= monsterY + 32 &&
    monsterY <= heroY + 32
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    // 6. if I catch the monster then the monster is randomly placed on the screen
    monsterX = Math.floor(Math.random() * (canvas.width - 32) + 32);
    monsterY = Math.floor(Math.random() * (canvas.height - 40) + 32);
    console.log("mosnter", monsterX, monsterY);
    score += 1;
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  ctx.fillText(
    `Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`,
    20,
    100
  );
  // 7. I see my score update when I catch the monster.
  ctx.fillText(`Score: ${score}`, 20, 80);
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function() {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();
