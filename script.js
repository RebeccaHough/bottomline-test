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
const popupDistance = 2; //rem //todo but game area is in px
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
    updateGameStateText(false, "Game in progress.");
    game = setInterval(() => {
        let moles = document.getElementsByClassName("mole");
        //set up click listeners
        let gamearea = document.getElementById("game");
        gamearea.addEventListener('click', moleClickMiss);


        // for(let mole of moles) {
        //     mole.addEventListener('click', moleClicked)
        //     = new Mole(mole, timer)
        // }


        let mole = selectMole(moles);
        popup(mole);
        
    }, 3000) //todo ramp up time between moles
}

function pauseGame() {
    console.log("Game paused.");
    updateGameStateText(false, "Game paused.");
    clearInterval(game);
}

//todo
//reset game timer and clear current score
function resetGame() {
    updateGameStateText(true);
    updateScore(0);
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
 */
function popup(mole) {
    mole.style.transform = "translateY(" + -popupDistance + "rem)";
    let timer = setTimeout(() => {
        popdown(mole);
        mole.removeEventListener('click', function wrapper(e, mole, timer) {
            moleClickHit.call(e, mole, timer, wrapper)
        });
    }, popupTimer)
    mole.addEventListener('click', function wrapper(e, mole, timer) {
        moleClickHit.call(e, mole, timer, wrapper)
    });
}



function popdown(mole) {
    mole.style.transform = "translateY(" + popupDistance + "rem)";
}

/**
 * Handle game updates for a successful mole whack
 * @param {Element} mole 
 * @param {number} timer timeout ID of the timer to clear
 */
function moleClickHit(mole, timer, wrapper) {
    console.log("Hit!");
    console.log(this)
    console.log(wrapper)
    updateScore(1);
    //make mole pop down immediately
    clearTimeout(timer);
    popdown(mole);
    //prevent event bubbling up to gamearea (which will trigger a miss)
    this.stopPropagation();
    //ensure mole can't be clicked twice
    mole.removeEventListener('click', wrapper);
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

class Mole {
    constructor(el) {
        this.el = el;
        this.timer;
    };

    addTimer(timer) {
        this.timer = timer;
    }

    handleEvent(e) {
        if(e.type === "click")
            this.moleClickHit(e, this.el, this.timer, this.moleClickHit)
    }

    /**
     * Handle game updates for a successful mole whack
     * @param {Element} mole 
     * @param {number} timer timeout ID of the timer to clear
     */
    moleClickHit(mole, timer, eventListener) {
        console.log("Hit!");
        console.log(this)
        console.log(eventListener)
        updateScore(1);
        //make mole pop down immediately
        clearTimeout(timer);
        popdown(mole);
        //prevent event bubbling up to gamearea (which will trigger a miss)
        this.stopPropagation();
        //ensure mole can't be clicked twice
        mole.removeEventListener('click', eventListener);
    }
}