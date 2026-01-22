document.addEventListener('DOMContentLoaded', function() {
    const whackGame = document.getElementById('whackGame');
    const ticGame = document.getElementById('ticGame');
    const rpsGame = document.getElementById('rpsGame');

    // Menu buttons
    const btnWhack = document.getElementById('btn-whack');
    const btnTic = document.getElementById('btn-tictactoe');
    const btnRPS = document.getElementById('btn-rps');

    // when clicked, the games will show up
    function showGame(game) {
        [whackGame, ticGame, rpsGame].forEach(g => g.style.display = 'none');
        game.style.display = 'block';
    }

    // Menu
    btnWhack.addEventListener('click', () => {
        showGame(whackGame);
        startWhack();
    });
    btnTic.addEventListener('click', () => {
        showGame(ticGame);
        resetTic();
    });
    btnRPS.addEventListener('click', () => {
        showGame(rpsGame);
    });

    // Whack-a-Mole game
    function startWhack() {
        let score = 0;
        let timeLeft = 30;
        const scoreSpan = document.getElementById('whack-score');
        const timerSpan = document.getElementById('whack-timer');
        const cells = document.querySelectorAll('.whack-cell');
        let moleIndex = -1;
        let gameInterval, moleInterval;

        function showMole() {
            if (moleIndex >= 0) {
                cells[moleIndex].classList.remove('active');
            }
            moleIndex = Math.floor(Math.random() * cells.length);
            cells[moleIndex].classList.add('active');
        }

        cells.forEach(cell => cell.classList.remove('active'));
        score = 0;
        timeLeft = 30;
        scoreSpan.textContent = 'Score: ' + score;
        timerSpan.textContent = 'Time: ' + timeLeft;

        cells.forEach(cell => {
            cell.onclick = function() {
                if (cell.classList.contains('active')) {
                    score++;
                    scoreSpan.textContent = 'Score: ' + score;
                    cell.classList.remove('active');
                }
            };
        });

        showMole();
        moleInterval = setInterval(showMole, 800);
        gameInterval = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = 'Time: ' + timeLeft;
            if (timeLeft <= 0) {
                clearInterval(gameInterval);
                clearInterval(moleInterval);
                if (moleIndex >= 0) {
                    cells[moleIndex].classList.remove('active');
                }
                alert('Time up! Your score: ' + score);
            }
        }, 1000);
    }

    // Tic Tac Toe game
    const ticCells = document.querySelectorAll('.tic-cell');
    const ticTurn = document.getElementById('tic-turn');
    const ticStatus = document.getElementById('tic-status');
    const ticReset = document.getElementById('tic-reset');
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;

    function checkWin() {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
        let roundWon = false;
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                break;
            }
        }
        if (roundWon) {
            ticStatus.textContent = currentPlayer + ' wins!';
            gameActive = false;
            return;
        }
        if (!board.includes('')) {
            ticStatus.textContent = 'Draw!';
            gameActive = false;
        }
    }

    function handleCellClick() {
        const index = this.getAttribute('data-index');
        if (board[index] !== '' || !gameActive) {
            return;
        }
        board[index] = currentPlayer;
        this.textContent = currentPlayer;
        checkWin();
        if (gameActive) {
            currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
            ticTurn.textContent = 'Turn: ' + currentPlayer;
        }
    }

    ticCells.forEach(cell => cell.addEventListener('click', handleCellClick));
    ticReset.addEventListener('click', resetTic);

    function resetTic() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        ticStatus.textContent = '';
        ticTurn.textContent = 'Turn: ' + currentPlayer;
        ticCells.forEach(cell => cell.textContent = '');
    }

    // Rock Paper Scissors
    const rpsButtons = document.querySelectorAll('#rps-options button');
    const rpsResult = document.getElementById('rps-result');
    const rpsScore = document.getElementById('rps-score');
    let playerScore = 0;
    let compScore = 0;

    rpsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const playerChoice = this.getAttribute('data-choice');
            const choices = ['Rock', 'Paper', 'Scissors'];
            const compChoice = choices[Math.floor(Math.random() * 3)];
            let result = '';
            if (playerChoice === compChoice) {
                result = "It's a draw! Both chose " + playerChoice + ".";
            } else if (
                (playerChoice === 'Rock' && compChoice === 'Scissors') ||
                (playerChoice === 'Paper' && compChoice === 'Rock') ||
                (playerChoice === 'Scissors' && compChoice === 'Paper')
            ) {
                playerScore++;
                result = 'You win! ' + playerChoice + ' beats ' + compChoice + '.';
            } else {
                compScore++;
                result = 'You lose! ' + compChoice + ' beats ' + playerChoice + '.';
            }
            rpsResult.textContent = result;
            rpsScore.textContent = 'Player: ' + playerScore + ' | Computer: ' + compScore;
        });
    });

    //all games will be hidden initially.
    [whackGame, ticGame, rpsGame].forEach(g => g.style.display = 'none');
});
