// This function runs when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize variables to keep track of game state and scores
    let intervalScore = 0;
    let fish1Count = 0;
    let starfishCount = 0;
    let jellyfishCount = 0;

    // Get references to various buttons and elements on the page
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('stopButton');
    const instructionsButton = document.getElementById('instructionsButton');
    const instructionsPopup = document.getElementById('instructionsPopup');
    const closeInstructionsButton = document.getElementById('closeInstructionsButton');
    const breakdownTabButton = document.getElementById('breakdownTabButton');
    const closeBreakdownButton = document.getElementById('closeBreakdownTabButton');

    // Add event listeners to buttons
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
    instructionsButton.addEventListener('click', showInstructions);
    closeInstructionsButton.addEventListener('click', hideInstructions);
    breakdownTabButton.addEventListener('click', openBreakdownTab);
    closeBreakdownButton.addEventListener('click', closeBreakdownTab);

     // Initialize timer and score variables
    let timerInterval;
    let score = 0;
    let objectChangeInterval;

    // Function to reset fish images to initial state
    function resetImages() {
        const objects = document.querySelectorAll('.circle img');
        objects.forEach(object => {
            object.src = `images/fish${Math.floor(Math.random() * 6) + 1}_close.png`;
            object.classList.remove('clicked');
        });
    }

    // Function to start the game
    function startGame() {
        // Disable start button
        startButton.disabled = true;

        // Get initial counts of fish, starfish, and jellyfish
        initialFish1Count = document.querySelectorAll('.circle img[src*="Fish1"]').length;
        initialStarfishCount = document.querySelectorAll('.circle img[src*="Starfish"]').length;
        initialJellyfishCount = document.querySelectorAll('.circle img[src*="Jellyfish"]').length;

        // Play game reset sound
        const gameResetSound = document.getElementById('gameReset');
        gameResetSound.play();

        // Play background music
        const backgroundMusic = document.getElementById('musicBackground');
        backgroundMusic.loop = true;
        backgroundMusic.play();

        // Start countdown timer
        let timeLeft = 40;
        const timerElement = document.getElementById('timer');
        timerElement.textContent = 'Time: ' + timeLeft;
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = 'Time: ' + timeLeft;
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);

        // Change objects (fish, jellyfish, and starfish) randomly every 4 seconds
        objectChangeInterval = setInterval(changeObjects, 4000);
        changeObjects();
    }

    // Function to randomly change fish, jellyfish, and starfish images
    function changeObjects() {
        score += intervalScore;
        updateScore();
        intervalScore = 0;

        // Loop through all objects on the page
        const objects = document.querySelectorAll('.circle img');
        objects.forEach(object => {
            // Remove 'clicked' class from all objects
            object.classList.remove('clicked');

            // Randomly decide the type of object: fish, jellyfish, or starfish
            const randomObject = Math.random();
            if (randomObject < 0.6) {
                // Fish (60% chance)
                const isOpen = Math.random() < 0.5;
                const randomFish = Math.floor(Math.random() * 6) + 1;
                object.src = `images/fish${randomFish}_${isOpen ? 'Open' : 'Close'}.png`;
                object.removeEventListener('click', handleJellyfishClick);
                object.removeEventListener('click', handleStarfishClick);
                object.addEventListener('click', handleFishClick);
            } else if (randomObject < 0.98) {
                // Jellyfish (38% chance)
                object.src = 'images/jellyfish.png';
                object.removeEventListener('click', handleStarfishClick);
                object.removeEventListener('click', handleFishClick);
                object.addEventListener('click', handleJellyfishClick);
            } else {
                // Starfish (2% chance)
                object.src = 'images/starfish.png';
                object.removeEventListener('click', handleJellyfishClick);
                object.removeEventListener('click', handleFishClick);
                object.addEventListener('click', handleStarfishClick);
            }
        });
    }

    // Function to handle fish click
    function handleFishClick(event) {
        const clickedObject = event.target;
        const isOpen = clickedObject.src.includes('Open');
        if (isOpen) {
            const fishOpenSound = document.getElementById('fishOpen');
            fishOpenSound.play();
            score++;
            intervalScore++;
            updateScore();
            fish1Count++;
            clickedObject.classList.add('clicked');
            clickedObject.removeEventListener('click', handleFishClick);
        } else {
            const fishCloseSound = document.getElementById('fishClose');
            fishCloseSound.play();
        }
        updateScoreBreakdown();
    }

    // Function to handle jellyfish click
    function handleJellyfishClick(event) {
        const clickedObject = event.target;
        const jellyfishSound = document.getElementById('jellyfishZap');
        jellyfishSound.play();
        score -= 3;
        intervalScore -= 3;
        updateScore();
        jellyfishCount++;
        clickedObject.removeEventListener('click', handleJellyfishClick);
        clickedObject.classList.add('clicked');
        updateScoreBreakdown();
    }

    // Function to handle starfish click
    function handleStarfishClick(event) {
        const clickedObject = event.target;
        const starfishSound = document.getElementById('starfishYay');
        starfishSound.play();
        score += 3;
        intervalScore += 3;
        updateScore();
        starfishCount++;
        clickedObject.removeEventListener('click', handleStarfishClick);
        clickedObject.classList.add('clicked');
        updateScoreBreakdown();
    }

    // Function to end the game
    function endGame() {
        intervalScore = 0;
        clearInterval(objectChangeInterval);
        const backgroundMusic = document.getElementById('musicBackground');
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        const gameOverMessage = document.getElementById('gameEndedMessage');
        gameOverMessage.style.display = 'block';
        let scoreMessage;
        if (score < 10) {
            scoreMessage = "Oh no, try again!";
            document.getElementById('musicBad').play();
        } else if (score < 20) {
            scoreMessage = "Getting better!!";
            document.getElementById('musicOkay').play();
        } else if (score < 30) {
            scoreMessage = "You're soo good now!!";
            document.getElementById('musicGood').play();
        } else {
            scoreMessage = "YOU'RE TOO AMAZING!! THANKS FOR PLAYING!!";
            document.getElementById('musicBest').play();
        }
        gameOverMessage.textContent = scoreMessage;
        resetImages();
        startButton.disabled = false;
    }

    // Function to update the score display
    function updateScore() {
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = score;
        intervalScore = 0;
    }

    // Function to show game instructions
    function showInstructions() {
        const gameResetSound = document.getElementById('gameReset');
        gameResetSound.play();
        instructionsPopup.style.display = 'block';
    }

    // Function to hide game instructions
    function hideInstructions() {
        instructionsPopup.style.display = 'none';
    }

    // Function to open breakdown tab
    function openBreakdownTab() {
        // Open breakdown tab logic
        const gameResetSound = document.getElementById('gameReset');
        gameResetSound.play();
        const breakdownTab = document.getElementById('breakdownTab');
        breakdownTab.style.display = 'block'; // Show breakdown tab
    }

    // Function to close breakdown tab
    function closeBreakdownTab() {
        // Close breakdown tab logic
        const breakdownTab = document.getElementById('breakdownTab');
        breakdownTab.style.display = 'none'; // Hide breakdown tab
    }

    // Function to reset the game
    function resetGame() {
        fish1Count = 0;
        starfishCount = 0;
        jellyfishCount = 0;
        intervalScore = 0;
        clearInterval(objectChangeInterval);
        const backgroundMusic = document.getElementById('musicBackground');
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        const gameResetSound = document.getElementById('gameReset');
        gameResetSound.play();
        const gameOverMessage = document.getElementById('gameEndedMessage');
        gameOverMessage.style.display = 'none';
        clearInterval(timerInterval);
        const timerElement = document.getElementById('timer');
        timerElement.textContent = 'Time: 40';
        score = 0;
        updateScore();
        resetImages();
        startButton.disabled = false;
    }

    // Initialize score breakdown
    updateScoreBreakdown();
});
