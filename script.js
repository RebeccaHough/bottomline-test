
/** How long to pop moles up for in ms */
const popupTimer = 1000; //todo convert to rand
/** Distance to move moles up and down by in rem */
const popupDistance = 2; //todo but game area is in px
/** Total game length in milliseconds */
const totalGameTime = 20000;
/** Time between one mole popping up and the next */
const timeBetweenMoles = 2500;
/** Interval id of current game. Used to pause the game */
let game;
/** HTML element of the game area */
let gamearea;
/** Game score */
let score = 0;
/** Timer ID for game countdown timer */
let gameTimer;
/** Time to start counting down from the next time the timer is started or restarted */
let timeToCountdownFrom = totalGameTime;
/** References to the html element and timer ID for the current mole. 
 * Used to popdown the mole if it is hit */
let mole, timer;
/** Whether the game is currently paused */
let paused = true;
/** Whether the current game is over */
let ended = false;

window.onload = function(e) {
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
    
    //set timer's initial value
    setTimerValue(document.getElementById("timeLeft"), timeToCountdownFrom);
}

/**
 * Start the game if it was previously paused
 */
function startGame() {
    //prevent unpausing game if game is over
    if(ended) return;
    //prevent multiple 'games' from being started
    if(!paused) return;
    paused = false;

    console.log("Game started.");
    updateGameStateText(true, "Game in progress.");

    //toggle buttons
    updateButton("pauseBtn", true);
    updateButton("startBtn", false);

    let moles = document.getElementsByClassName("mole");

    //do first mole
    mole = selectMole(moles);
    timer = popup(mole);  

    game = setInterval(function() {    
        mole = selectMole(moles);
        timer = popup(mole);     
    }, timeBetweenMoles);

    //start/unpause countdown game timer
    startTimer(document.getElementById("timeLeft"), timeToCountdownFrom);
}

/**
 * Pause the game by clearing the game's interval ID
 */
function pauseGame() {
    //if game has ended/is already paused, prevent pausing
    if(ended || paused) return;
    console.log("Game paused.");
    updateGameStateText(true, "Game paused.");
    clearInterval(game);
    pauseTimer();
    //to avoid having to un/re-register game area click listener
    //use global paused variable to prevent firing and score updates
    paused = true;
    //toggle buttons
    updateButton("pauseBtn", false);
    updateButton("startBtn", true);
}

/**
 * Reset the game timer and clear the current score and game state text
 */
function resetGame() {
    ended = false;
    pauseGame();
    //override from pauseGame()
    updateButton("startBtn", true);

    updateGameStateText(false);
    updateScore(0);
    timeToCountdownFrom = totalGameTime;
    setTimerValue(document.getElementById("timeLeft"), timeToCountdownFrom)
}

/**
 * End the game by pausing it, disabling the start and pause buttons,
 * and updating the game state text
 */
function endGame() {
    clearInterval(game);
    clearInterval(gameTimer);
    paused = true;
    ended = true;
    updateGameStateText(true, "Game over! Final score: " + score);
    updateButton("pauseBtn", false);
    updateButton("startBtn", false);
}

/**
 * Start a countdown timer, and store a reference to it in the global gameTimer
 * @param {Element} gameTimerText html element to display timer inside
 * @param {number} duration how long to countdown for in milliseconds
 */
function startTimer(gameTimerText, duration) {
    let start, diff;
    start = Date.now();

    function timer() {
        //get the number of seconds that have elapsed since startTimer() was called
        diff = duration - (parseInt(Date.now() - start));
        //store current time elapsed to facilitate restarting of timer
        timeToCountdownFrom = diff;
        
        //set in dom
        setTimerValue(gameTimerText, diff);
        
        //get difference in seconds
        diff = diff / 1000;
        //if timer reaches zero
        if(diff <= 0) endGame();
    };
    //exec timer() once first, to start the timer without waiting a whole second
    timer();
    gameTimer = setInterval(timer, 1000);
}

/**
 * Pause the game's countdown timer
 */
function pauseTimer() {
    clearInterval(gameTimer);
}

/**
 * Set the timer's value
 * @param {Element} gameTimerText 
 * @param {number} time in milliseoncds
 */
function setTimerValue(gameTimerText, time) {
    //convert to seconds
    time = time / 1000

    //truncate
    let minutes = parseInt(time / 60);
    let seconds = parseInt(time % 60);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    gameTimerText.innerHTML = minutes + ":" + seconds;
}

/**
 * Determine whether a click was a hit or a miss and act accordingly
 * @param {Event} e 
 */
function clickHandler(e) {
    //prevent score updates
    if(paused) return;
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
 * @returns {Element} a HTML Element for the chosen mole
 */
function selectMole(moles) {
    let max = moles.length;
    let num = Math.floor(Math.random() * max);
    console.log("Mole chosen: " + num);
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
    let timer = setTimeout(function() {
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
 * Handle game updates for a successful mole whack
 * @param {Element} mole HTML element to be moved
 * @param {number} timer timer ID to be cleared
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
 * @param {boolean} show if true, display game state text; if false, don't display 
 * @param {string} text optional text to set game state text to
 */
function updateGameStateText(show, text) {
    let gameState = document.getElementById("gameState");
    if(!show) {
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

/**
 * Visually enable/disable the button with id buttonName
 * by adding/removing 'disabled' css class 
 * @param {string} buttonName id of the button to set state of
 * @param {boolean} state true to enable button, false to disable button
 */
function updateButton(buttonName, state) {
    let button = document.getElementById(buttonName);
    state ?  
        button.classList.remove("disabled") : button.classList.add("disabled");
    button.setAttribute("aria-pressed", !state);
}