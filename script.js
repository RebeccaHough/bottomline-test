//todo click to go away
//todo difficulty ramp
//todo fix jumping when moving down
//todo fix start position and overflow

const popupTimer = 1000; //ms
const popupDistance = 2; //rem
let game;
let score = 0;
let timers;

window.onload = (e) => {
    //set up buttons
    let startBtn = document.getElementById("startBtn");
    let pauseBtn = document.getElementById("pauseBtn");
    let clearBtn = document.getElementById("clearBtn");
    startBtn.onclick = startGame;
    pauseBtn.onclick = pauseGame;
    clearBtn.onclick = updateScore.bind(this, 0);
    
}

function startGame() {
    console.log("Game started.");
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
    clearInterval(game);
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
 * @param {*} amount 
 */
function updateScore(amount) {
    score += amount;
    document.getElementById("score").innerHTML = score;
}