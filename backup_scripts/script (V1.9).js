document.addEventListener('DOMContentLoaded', function () {
    // Start Game Button
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame);

    // Reset Game Button
    const resetButton = document.getElementById('stopButton');
    resetButton.addEventListener('click', resetGame);

    // Instructions Button
    const instructionsButton = document.getElementById('instructionsButton');
    const instructionsPopup = document.getElementById('instructionsPopup');
    const closeInstructionsButton = document.getElementById('closeInstructionsButton');

    instructionsButton.addEventListener('click', function () {
        instructionsPopup.style.display = 'block'; // Show instructions popup
    });

    closeInstructionsButton.addEventListener('click', function () {
        instructionsPopup.style.display = 'none'; // Hide instructions popup
    });

    let timerInterval; // Interval for countdown
    let score = 0; // Initial score

    // Function to start the game
    function startGame() {
        startButton.disabled = true; // Disable start button during game

        // Play background music
        const backgroundMusic = document.getElementById('musicBackground');
        backgroundMusic.loop = true;
        backgroundMusic.play();

        // Start countdown
        let timeLeft = 40;
        const timerElement = document.getElementById('timer');
        timerElement.textContent = 'Time: ' + timeLeft;
        timerInterval = setInterval(function () {
            timeLeft--;
            timerElement.textContent = 'Time: ' + timeLeft;
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);

        // Change objects (fish, jellyfish, and starfish) randomly every 4 seconds
        setInterval(changeObjects, 4000);
        changeObjects();
    }

    // Function to randomly change fish, jellyfish, and starfish images
    function changeObjects() {
        const objects = document.querySelectorAll('.circle img');
        objects.forEach(function (object) {
            // Randomly decide the type of object: fish, jellyfish, or starfish
            const randomObject = Math.random(); // Random number between 0 and 1
            if (randomObject < 0.6) {
                // Fish (60% chance)
                const isOpen = Math.random() < 0.5; // Randomly decide if fish's mouth is open or closed
                const randomFish = Math.floor(Math.random() * 6) + 1; // Random fish number between 1 and 6
                object.src = `images/fish${randomFish}_${isOpen ? 'Open' : 'Close'}.png`;
                object.classList.remove('clicked'); // Ensure fish is clickable again
                object.removeEventListener('click', handleJellyfishClick); // Remove event listener for jellyfish click
                object.removeEventListener('click', handleStarfishClick); // Remove event listener for starfish click
                object.addEventListener('click', handleFishClick); // Add event listener for fish click
            } else if (randomObject < 0.98) {
                // Jellyfish (38% chance)
                object.src = 'images/jellyfish.png'; // Set jellyfish image
                object.classList.remove('clicked'); // Ensure jellyfish is clickable again
                object.removeEventListener('click', handleStarfishClick); // Remove event listener for starfish click
                object.removeEventListener('click', handleFishClick); // Remove event listener for fish click
                object.addEventListener('click', handleJellyfishClick); // Add event listener for jellyfish click
            } else {
                // Starfish (2% chance)
                object.src = 'images/starfish.png'; // Set starfish image
                object.classList.remove('clicked'); // Ensure starfish is clickable again
                object.removeEventListener('click', handleJellyfishClick); // Remove event listener for jellyfish click
                object.removeEventListener('click', handleFishClick); // Remove event listener for fish click
                object.addEventListener('click', handleStarfishClick); // Add event listener for starfish click
            }
        });
    }

    // Function to handle clicks on fish, jellyfish, and starfish
    function handleFishClick(event) {
        const clickedObject = event.target;

        // Check if the fish's mouth is open
        const isOpen = clickedObject.src.includes('Open');
        if (isOpen) {
            // Play fish open sound
            const fishOpenSound = document.getElementById('fishOpen');
            fishOpenSound.play();

            // Increment score
            score++;
            updateScore();

            // Gray out the clicked fish image
            clickedObject.classList.add('clicked');
            // Disable further interaction with the clicked fish image
            clickedObject.removeEventListener('click', handleFishClick);
        } else {
            // Play fish close sound
            const fishCloseSound = document.getElementById('fishClose');
            fishCloseSound.play();
        }
    }

    // Function to handle jellyfish click
    function handleJellyfishClick(event) {
        const clickedObject = event.target;

        // Play jellyfish sound
        const jellyfishSound = document.getElementById('jellyfishSound');
        jellyfishSound.play();

        // Decrease score by 3 points
        score -= 3;
        updateScore();

        // Disable further interaction with the clicked jellyfish
        clickedObject.removeEventListener('click', handleJellyfishClick);
        clickedObject.classList.add('clicked');
    }

    // Function to handle starfish click
    function handleStarfishClick(event) {
        const clickedObject = event.target;

        // Play starfish sound
        const starfishSound = document.getElementById('starfishSound');
        starfishSound.play();

        // Increase score by 3 points
        score += 3;
        updateScore();

        // Disable further interaction with the clicked starfish
        clickedObject.removeEventListener('click', handleStarfishClick);
        clickedObject.classList.add('clicked');
    }

    // Function to end the game
    function endGame() {
        // Stop background music
        const backgroundMusic = document.getElementById('musicBackground');
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;

        // Display game over message
        const gameOverMessage = document.getElementById('gameEndedMessage');
        gameOverMessage.style.display = 'block';

        // Determine and display score message
        let scoreMessage;
        if (score < 10) {
            scoreMessage = "Oh no, try again!";
            const musicBad = document.getElementById('musicBad');
            musicBad.play();
        } else if (score < 20) {
            scoreMessage = "Getting better!!";
            const musicOkay = document.getElementById('musicOkay');
            musicOkay.play();
        } else if (score < 30) {
            scoreMessage = "You're soo good now!!";
            const musicGood = document.getElementById('musicGood');
            musicGood.play();
        } else {
            scoreMessage = "YOU'RE TOO AMAZING!! THANKS FOR PLAYING!!";
            const musicBest = document.getElementById('musicBest');
            musicBest.play();
        }
        gameOverMessage.textContent = scoreMessage;

        // Enable start button for next game
        startButton.disabled = false;
    }

    // Function to update the score display
    function updateScore() {
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = score;
    }

    // Function to reset the game
    function resetGame() {
        // Stop background music
        const backgroundMusic = document.getElementById('musicBackground');
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;

        // Play game reset sound
        const gameResetSound = document.getElementById('gameReset');
        gameResetSound.play();

        // Hide game over message
        const gameOverMessage = document.getElementById('gameEndedMessage');
        gameOverMessage.style.display = 'none';

        // Reset timer
        clearInterval(timerInterval);
        const timerElement = document.getElementById('timer');
        timerElement.textContent = 'Time: 40';

        // Reset score
        score = 0;
        updateScore();

        // Reset objects (fish, jellyfish, and starfish)
        changeObjects();
    }
});
