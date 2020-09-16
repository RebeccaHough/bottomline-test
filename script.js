//todo
//fix spam clicking start game
//visible for random amount of time
//time limit
//fix jumping when moving down
//fix start position and overflow
//IE/responsiveness implementation/testing 
    //(make moles flow onto new lines if insufficient space; stack buttons)
//accessibility (button labels, img labels/alts)
    //keydown for buttons (with labels to say what key to press)
    //keydown for moles
//docs

//nice-to-have
//prettier text/game (rounder mole holes)
//unit test
//sound
//cursor animation/change on successful hit

/** How long to pop moles up for in ms */
const popupTimer = 1000; //todo convert to rand
/** Distance to move moles up and down by in rem */
const popupDistance = 2; //todo but game area is in px
/** Total game length in milliseconds */
const totalGameTime = 60000;
/** Interval id of current game. Used to pause the game */
let game;
/** HTML element of the game area */
let gamearea;
/** Game score */
let score = 0;
/** Game countdown timer */
let gameTimer = totalGameTime; 
/** References to the html element and timer ID for the current mole. 
 * Used to popdown the mole if it is hit */
let mole, timer;
/** Whether the game is currently paused */
let paused = true;

window.onload = (e) => {
    //set up buttons
    let startBtn = document.getElementById("startBtn");
    let pauseBtn = document.getElementById("pauseBtn");
    let resetBtn = document.getElementById("resetBtn");
    startBtn.onclick = startGame;
    pauseBtn.onclick = pauseGame;
    resetBtn.onclick = resetGame;

    //set up click listener
    gamearea = document.getElementById("game");
    gamearea.addEventListener('click', clickHandler);
}

function startGame() {
    //prevent multiple 'games' from being started
    if(!paused) return;
    paused = false;

    console.log("Game started.");
    updateGameStateText(false, "Game in progress.");

    //toggle buttons
    document.getElementById("pauseBtn").classList.remove("disabled");
    document.getElementById("pauseBtn").setAttribute("aria-pressed", false);
    document.getElementById("startBtn").classList.add("disabled");
    document.getElementById("startBtn").setAttribute("aria-pressed", true);

    let moles = document.getElementsByClassName("mole");

    game = setInterval(() => {    

        mole = selectMole(moles);
        timer = popup(mole);
        
    }, 3000) //todo ramp up time between moles

    //todo countdown game timer
}

/**
 * Pause the game by clearing the game's interval ID
 */
function pauseGame() {
    console.log("Game paused.");
    updateGameStateText(false, "Game paused.");
    clearInterval(game);
    //to avoid having to un/re-register game area click listener
    //use global paused variable to prevent score updates
    paused = true;
    //toggle buttons
    document.getElementById("pauseBtn").classList.add("disabled");
    document.getElementById("pauseBtn").setAttribute("aria-pressed", true);
    document.getElementById("startBtn").classList.remove("disabled");
    document.getElementById("startBtn").setAttribute("aria-pressed", false);
}

/**
 * Reset the game timer and clear the current score and game state text
 */
function resetGame() {
    pauseGame();
    updateGameStateText(true);
    updateScore(0);
    gameTimer = totalGameTime;
}

/**
 * Determine whether a click was a hit or a miss and act accordingly
 * @param {Event} e 
 */
function clickHandler(e) {
    //prevent score updates
    if(paused) return;
    console.log(e.target);
    if(
        e.target.dataset 
        && e.target.dataset.moleState 
        && (e.target.dataset.moleState == "active")
    )
        moleClickHit(mole, timer);
    else 
        moleClickMiss();
}

/**
 * Get random mole from array of moles (pseudo-random)
 * @param {HTMLCollection} moles 
 */
function selectMole(moles) {
    let max = moles.length;
    let num = Math.floor(Math.random() * max);
    console.log(num);
    return moles[num];
}

/**
 * Moves mole up by [popupDistance]rem and sets a timer for popdown
 * @param {Element} mole HTML element to be moved
 * @returns {number} the timer ID for the timer that specifies how long the 
 * mole will be popped up for
 */
function popup(mole) {
    mole.style.transform = "translateY(" + -popupDistance + "rem)";
    mole.dataset.moleState = "active"
    let timer = setTimeout(() => {
        popdown(mole);
    }, popupTimer);
    return timer
}

/**
 * Moves mole down by [popupDistance]rem and sets a timer for popdown
 * @param {Element} mole HTML element to be moved
 */
function popdown(mole) {
    mole.style.transform = "translateY(" + popupDistance + "rem)";
    mole.dataset.moleState = "hidden"
}

/**
 * Handle game updates for an unsuccessful mole whack
 */
function moleClickHit(mole, timer) {
    console.log("Hit!");
    updateScore(1);
    //make mole pop down immediately
    clearTimeout(timer);
    popdown(mole);
}

/**
 * Handle game updates for an unsuccessful mole whack
 */
function moleClickMiss() {
    console.log("Miss!");
    updateScore(-1);
}

/**
 * Add amount to score and inform user. If amount is 0, score is set to 0 instead.
 * @param {number} amount 
 */
function updateScore(amount) {
    if(amount !== 0)
        score += amount;
    else 
        score = 0;
    document.getElementById("score").innerHTML = score;
}

/**
 * Inform the user of the current game state
 * @param {boolean} hide if true, don't display game state text 
 * @param {string} text optional text to set game state text to
 */
function updateGameStateText(hide, text) {
    let gameState = document.getElementById("gameState");
    if(hide) {
        gameState.hidden = true;
        gameState.classList.remove('show');
        gameState.classList.add('hidden');
    } else {
        gameState.hidden = false;
        gameState.classList.remove('hidden');
        gameState.classList.add('show');
    }
    if(text)
        gameState.innerHTML = text;
}