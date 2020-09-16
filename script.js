//todo
//click to go away
//fix spam clicking start game --- toggle buttons  aria-pressed="false"
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

const popupTimer = 1000; //ms
const popupDistance = 2; //rem
let game;
let score = 0;
let gameTimer = 60000; //ms
let timers;

window.onload = (e) => {
    //set up buttons
    let startBtn = document.getElementById("startBtn");
    let pauseBtn = document.getElementById("pauseBtn");
    let resetBtn = document.getElementById("resetBtn");
    startBtn.onclick = startGame;
    pauseBtn.onclick = pauseGame;
    resetBtn.onclick = resetGame;
    
}

function startGame() {
    console.log("Game started.");
    updateGameState(false, "Game in progress.");
    game = setInterval(() => {
        let moles = document.getElementsByClassName("mole");
        //set up click listeners
        // for(let mole of moles) {
        //     mole.addEventListener("", moleClicked)
        // }
        let mole = selectMole(moles);
        popup(mole);
        
    }, 3000) //todo ramp up time between moles
}

function pauseGame() {
    console.log("Game paused.");
    updateGameState(false, "Game paused.");
    clearInterval(game);
}

//todo
//reset game timer and clear current score
function resetGame() {
    updateGameState(true);
    updateScore(0);
}

/**
 * Get random mole from array of moles
 * @param {*} moles 
 */
function selectMole(moles) {
    let max = moles.length;
    let num = Math.floor(Math.random() * max);
    console.log(num);
    console.log(moles[num]);
    return moles[num];
}

/**
 * Moves mole up by [popupDistance]rem and sets a timer for popdown
 * @param {*} mole HTML element to be moved
 */
function popup(mole) {
    mole.style.transform = "translateY(" + -popupDistance + "rem)";
    let timer = setTimeout(() => {
        popdown(mole);
    }, popupTimer)
    return timer;
}

function popdown(mole) {
    mole.style.transform = "translateY(" + popupDistance + "rem)";
}

function moleClicked(mole) {
    //todo check if correct or not

    //get reference to mole's timer and clear it
    clearTimeout(timers[x, y]);
    popdown(mole);
    //update score
    updateScore(1);
}

/**
 * Add amount to score and update in DOM
 * @param {number} amount 
 */
function updateScore(amount) {
    score += amount;
    document.getElementById("score").innerHTML = score;
}

/**
 * Inform the user of the current game state
 * @param {boolean} hide don't display game state text if true
 * @param {string} text optional text to set game state text to
 */
function updateGameState(hide, text) {
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