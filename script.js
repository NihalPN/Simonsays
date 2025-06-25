const gameSequence = [];
let playerSequence = [];    
let level = 0;             
let canClick = false;       
let gameStarted = false;   
let soundDelay = 500;       
let playerTurnDelay = 700; 
let highlightDuration = 300; 


const buttons = [
    document.getElementById('button-0'),
    document.getElementById('button-1'),
    document.getElementById('button-2'),
    document.getElementById('button-3')
];
const buttonSounds = [
    document.getElementById('sound-0'),
    document.getElementById('sound-1'),
    document.getElementById('sound-2'),
    document.getElementById('sound-3')
];
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('scoreDisplay');
const messageBox = document.getElementById('messageBox');

startButton.addEventListener('click', startGame);

buttons.forEach((button, index) => {
    button.addEventListener('click', () => handlePlayerClick(index));
  
    button.addEventListener('mousedown', () => {
        if (canClick) {
            button.classList.add('active');
        }
    });
    button.addEventListener('mouseup', () => {
        if (canClick) {
            button.classList.remove('active');
        }
    });
    button.addEventListener('mouseleave', () => {

        button.classList.remove('active');
    });
});

function startGame() {
    if (gameStarted) return; 
    
    gameSequence.length = 0; 
    playerSequence.length = 0;
    level = 0; 
    gameStarted = true; 
    canClick = false; 
    startButton.disabled = true; 
    startButton.classList.add('disabled'); 
    showMessage('Game Started! Watch carefully.', 'info');
    
    scoreDisplay.textContent = `Level: ${level}`;

    nextRound(); 
}


async function nextRound() {
    level++;
    scoreDisplay.textContent = `Level: ${level}`;
    playerSequence.length = 0;
    canClick = false; 
    
    showMessage(`Level ${level}! Get ready...`, 'info');


    const nextButton = Math.floor(Math.random() * 4);
    gameSequence.push(nextButton);


    await new Promise(resolve => setTimeout(resolve, playerTurnDelay));
    
    await playSequence();
    
 
    canClick = true;
    showMessage('Your turn!', 'info');

    buttons.forEach(button => button.classList.remove('disabled'));
}

/**
@returns {Promise<void>} 
 */
async function playSequence() {
   
    buttons.forEach(button => button.classList.add('disabled'));

    for (let i = 0; i < gameSequence.length; i++) {
        const buttonIndex = gameSequence[i];
        
        await new Promise(resolve => setTimeout(resolve, soundDelay)); 
        lightUpButton(buttonIndex); 
        playSound(buttonIndex);   

        await new Promise(resolve => setTimeout(resolve, highlightDuration));
        lightUpButton(buttonIndex, false); 

        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

/**
  @param {number} buttonIndex 
 */
function handlePlayerClick(buttonIndex) {
    if (!canClick || !gameStarted) return; 

    playSound(buttonIndex); 
    playerSequence.push(buttonIndex); 


    const currentGuessIndex = playerSequence.length - 1;
    if (playerSequence[currentGuessIndex] !== gameSequence[currentGuessIndex]) {
     
        endGame('Wrong button! Game Over.');
        return;
    }

   
    if (playerSequence.length === gameSequence.length) {
        
        canClick = false; 
        showMessage('Correct! Preparing next level...', 'success');
     
        setTimeout(() => {
            nextRound();
        }, 1000);
    }
}

/**
 * Lights up or turns off a specific game button.
 * @param {number} index - The index of the button to light up/turn off.
 * @param {boolean} [on=true] - True to light up, false to turn off.
 */
function lightUpButton(index, on = true) {
    if (on) {
        buttons[index].classList.add('active');
    } else {
        buttons[index].classList.remove('active');
    }
}

/**
 * Plays the sound associated with a specific button.
 * Clones the node to allow overlapping sounds (e.g., rapid clicks).
 * @param {number} index - The index of the sound to play.
 */
function playSound(index) {
    const sound = buttonSounds[index].cloneNode(); 
    sound.play();
}

/**
 * Ends the current game.
 * Resets game state and displays a game over message.
 * @param {string} message - The message to display upon game over.
 */
function endGame(message) {
    gameStarted = false; 
    canClick = false; 
    startButton.disabled = false;
    startButton.classList.remove('disabled');
    buttons.forEach(button => button.classList.add('disabled'));
    
    showMessage(`${message} Your final score: Level ${level -1}.`, 'error'); 
    scoreDisplay.textContent = `Level: 0`;
}

/**
 * Displays a message in the message box.
 * @param {string} msg - The message text.
 * @param {string} type - 'info', 'success', or 'error' to apply specific styling.
 */
function showMessage(msg, type = 'info') {
    messageBox.textContent = msg;
    messageBox.classList.remove('error', 'success', 'info');
    messageBox.classList.add(type);
}

window.onload = () => {

    buttons.forEach(button => button.classList.add('disabled'));
    showMessage('Press Start to begin!', 'info');
};
