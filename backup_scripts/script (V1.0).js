document.addEventListener('DOMContentLoaded', function () {
    // Start Game Button
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame);

    // Reset Game Button
    const resetButton = document.getElementById('stopButton');
    resetButton.addEventListener('click', resetGame);

    let timerInterval; // Interval for countdown
    let score = 0; // Initial score

    function startGame() {
        // Disable start button during game
        startButton.disabled = true;

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

        // Change fish images randomly every 4 seconds
        setInterval(changeFishImages, 4000);
        changeFishImages();
    }

    function changeFishImages() {
        const fishImages = document.querySelectorAll('.circle img');
        fishImages.forEach(function (fish) {
            const randomFish = Math.floor(Math.random() * 6) + 1; // Random fish number between 1 and 6
            const isOpen = Math.random() < 0.5; // Randomly decide if fish's mouth is open or closed
            fish.src = `images/fish${randomFish}_${isOpen ? 'Open' : 'Close'}.png`;

            // Re-enable click event and remove 'clicked' class
            fish.classList.remove('clicked');
            fish.addEventListener('click', handleClick);
        });
    }

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
        const scoreElement = document.getElementById('score');
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
        const startButton = document.getElementById('startButton');
        startButton.disabled = false;
    }

    // Click event handler function
    function handleClick(event) {
        const clickedFishImage = event.target;

        // Check if the fish's mouth is open
        const isOpen = clickedFishImage.src.includes('Open');
        if (isOpen) {
            // Play fish open sound
            const fishOpenSound = document.getElementById('fishOpen');
            fishOpenSound.play();

            // Increment score
            score++;
            const scoreElement = document.getElementById('score');
            scoreElement.textContent = score;

            // Gray out the clicked fish image
            clickedFishImage.classList.add('clicked');
            // Disable further interaction with the clicked fish image
            clickedFishImage.removeEventListener('click', handleClick);
        } else {
            // Play fish close sound
            const fishCloseSound = document.getElementById('fishClose');
            fishCloseSound.play();
        }
    }

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
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = score;

        // Reset fish images
        changeFishImages();
    }
});
