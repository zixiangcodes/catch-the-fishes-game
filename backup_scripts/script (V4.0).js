document.addEventListener('DOMContentLoaded', function () {
    let intervalScore = 0;
    let fish1Count = 0;
    let starfishCount = 0;
    let jellyfishCount = 0;

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
        // Play game reset sound
        const gameResetSound = document.getElementById('gameReset');
        gameResetSound.play();
        instructionsPopup.style.display = 'block'; // Show instructions popup
    });

    closeInstructionsButton.addEventListener('click', function () {
        instructionsPopup.style.display = 'none'; // Hide instructions popup
    });

    let timerInterval; // Interval for countdown
    let score = 0; // Initial score
    let objectChangeInterval; // Interval for changing objects

    function resetImages() {
    const objects = document.querySelectorAll('.circle img');
    objects.forEach(function (object, index) {
        object.src = `images/fish${index % 6 + 1}_close.png`; // Assuming you have 6 different fish images
        object.classList.remove('clicked'); // Remove the 'clicked' class if it was added during gameplay
    });
}

    // Function to start the game
    function startGame() {
        startButton.disabled = true; // Disable start button during game

        // Initialize initial counts
        initialFish1Count = document.querySelectorAll('.circle img[src*="Fish1"]').length;
        initialStarfishCount = document.querySelectorAll('.circle img[src*="Starfish"]').length;
        initialJellyfishCount = document.querySelectorAll('.circle img[src*="Jellyfish"]').length;

        // Play game reset sound
        const gameResetSound = document.getElementById('gameReset');
        gameResetSound.play();

        // Play background music with 1 second delay
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
        objectChangeInterval = setInterval(changeObjects, 4000); // Assign the interval to objectChangeInterval
        changeObjects(); // Immediately change objects for the first time
    }

    // Function to randomly change fish, jellyfish, and starfish images
    function changeObjects() {
        // Add intervalScore to the total score before resetting it
        score += intervalScore;
        updateScore();
        intervalScore = 0; // Reset intervalScore to 0

        const objects = document.querySelectorAll('.circle img');
        objects.forEach(function (object) {
            // Remove the 'clicked' class from all objects
            object.classList.remove('clicked');

            // Randomly decide the type of object: fish, jellyfish, or starfish
            const randomObject = Math.random(); // Random number between 0 and 1
            if (randomObject < 0.6) {
                // Fish (60% chance)
                const isOpen = Math.random() < 0.5; // Randomly decide if fish's mouth is open or closed
                const randomFish = Math.floor(Math.random() * 6) + 1; // Random fish number between 1 and 6
                object.src = `images/fish${randomFish}_${isOpen ? 'Open' : 'Close'}.png`;
                object.removeEventListener('click', handleJellyfishClick); // Remove event listener for jellyfish click
                object.removeEventListener('click', handleStarfishClick); // Remove event listener for starfish click
                object.addEventListener('click', handleFishClick); // Add event listener for fish click
            } else if (randomObject < 0.98) {
                // Jellyfish (38% chance)
                object.src = 'images/jellyfish.png'; // Set jellyfish image
                object.removeEventListener('click', handleStarfishClick); // Remove event listener for starfish click
                object.removeEventListener('click', handleFishClick); // Remove event listener for fish click
                object.addEventListener('click', handleJellyfishClick); // Add event listener for jellyfish click
            } else {
                // Starfish (2% chance)
                object.src = 'images/starfish.png'; // Set starfish image
                object.removeEventListener('click', handleJellyfishClick); // Remove event listener for jellyfish click
                object.removeEventListener('click', handleFishClick); // Remove event listener for fish click
                object.addEventListener('click', handleStarfishClick); // Add event listener for starfish click
            }
        });
    }

    // Function to handle fish click
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
            intervalScore++;
            updateScore();

            // Increment fish1Count
            fish1Count++;

            // Gray out the clicked fish image
            clickedObject.classList.add('clicked');
            // Disable further interaction with the clicked fish image
            clickedObject.removeEventListener('click', handleFishClick);
        } else {
            // Play fish close sound
            const fishCloseSound = document.getElementById('fishClose');
            fishCloseSound.play();
        }

        // Update score breakdown
        updateScoreBreakdown();
    }

    // Function to handle jellyfish click
    function handleJellyfishClick(event) {
        const clickedObject = event.target;

        // Play jellyfish sound
        const jellyfishSound = document.getElementById('jellyfishZap');
        jellyfishSound.play();

        // Decrease score by 3 points
        score -= 3;
        intervalScore -= 3;
        updateScore();

        // Increment jellyfishCount
        jellyfishCount++;

        // Disable further interaction with the clicked jellyfish
        clickedObject.removeEventListener('click', handleJellyfishClick);
        clickedObject.classList.add('clicked');

        // Update score breakdown
        updateScoreBreakdown();
    }

    // Function to handle starfish click
    function handleStarfishClick(event) {
        const clickedObject = event.target;

        // Play starfish sound
        const starfishSound = document.getElementById('starfishYay');
        starfishSound.play();

        // Increase score by 3 points
        score += 3;
        intervalScore += 3;
        updateScore();

        // Increment starfishCount
        starfishCount++;

        // Disable further interaction with the clicked starfish
        clickedObject.removeEventListener('click', handleStarfishClick);
        clickedObject.classList.add('clicked');

        // Update score breakdown
        updateScoreBreakdown();
    }

    // Function to end the game
    function endGame() {
        intervalScore = 0; // Reset intervalScore to 0 when the game ends

         // Clear the interval to stop changing objects
        clearInterval(objectChangeInterval);

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

        // Reset images
        resetImages();

        // Enable start button for next game
        startButton.disabled = false;
    }

    // Function to update the score display
    function updateScore() {
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = score;
        intervalScore = 0; // Reset intervalScore to 0 after updating the score
    }

    // Add event listener for breakdown tab button
    const breakdownTabButton = document.getElementById('breakdownTabButton');
    breakdownTabButton.addEventListener('click', function () {
        // Play game reset sound
        const gameResetSound = document.getElementById('gameReset');
        gameResetSound.play();
        breakdownTab.style.display = 'block'; // Show breakdown tab
    });

    // Add event listener for close breakdown button
    const closeBreakdownButton = document.getElementById('closeBreakdownTabButton');
    closeBreakdownButton.addEventListener('click', function () {
        breakdownTab.style.display = 'none'; // Hide breakdown tab
    });

    // Initial counts of each type of object
    let initialFish1Count = 0;
    let initialStarfishCount = 0;
    let initialJellyfishCount = 0;

    // Update score breakdown
    function updateScoreBreakdown() {
        const fish1CountElement = document.getElementById('fish1Count');
        const starfishCountElement = document.getElementById('starfishCount');
        const jellyfishCountElement = document.getElementById('jellyfishCount');

        // Update the display with the counts
        fish1CountElement.textContent = fish1Count;
        starfishCountElement.textContent = starfishCount;
        jellyfishCountElement.textContent = jellyfishCount;

        // Insert here Console Log:
        console.log("1 Pt Fish Count: ", fish1Count);
        console.log("Starfish Count: ", starfishCount);
        console.log("Jellyfish Count: ", jellyfishCount);
    }

    const objects = document.querySelectorAll('.circle img');
    objects.forEach(function (object) {
        if (object.classList.contains('clicked')) {
            if (object.src.includes('_Open')) {
                fish1Count++;
            } else if (object.src.includes('starfish')) {
                starfishCount++;
            } else if (object.src.includes('jellyfish')) {
                jellyfishCount++;
            }
        }
    });

    // Function to reset the game
    function resetGame() {
        // Reset intervalScore and other counts to 0 when the game ends
        fish1Count = 0;
        starfishCount = 0;
        jellyfishCount = 0;
        intervalScore = 0; 

        // Clear the interval to stop changing objects
        clearInterval(objectChangeInterval);

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

        // Reset images
        resetImages();

        // Enable start button for next game
        startButton.disabled = false;
    }
});
