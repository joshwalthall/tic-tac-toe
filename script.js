const GameBoard = (function () {
    const gridTiles = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];
    const markCounts = {
        X: 0,
        O: 0,
    };

    const getGridTile = (rowNum,colNum) => {
        return gridTiles[rowNum][colNum];
    };
    const getAllGridTiles = () => {
        return gridTiles;
    };
    const markTile = (rowNum, colNum, mark) => {
        if (gridTiles[rowNum][colNum] === " ") {
            gridTiles[rowNum][colNum] = mark;
            return "valid";
        } else {
            return "invalid";
        };
    };
    const getMarkCount = (mark) => {
        return markCounts[mark];
    };
    const incrementMarkCount = (mark) => {
        markCounts[mark] += 1;
    };
    const print = () => {
        console.log(`
     ${getGridTile(0,0)} │ ${getGridTile(0,1)} │ ${getGridTile(0,2)}
    ───┼───┼───
     ${getGridTile(1,0)} │ ${getGridTile(1,1)} │ ${getGridTile(1,2)}
    ───┼───┼───
     ${getGridTile(2,0)} │ ${getGridTile(2,1)} │ ${getGridTile(2,2)}
        `);
    };
    const reset = () => {
        for (let i = 0; i < gridTiles.length; i++) {
            for (let j = 0; j < gridTiles[i].length; j++) {
                gridTiles[i][j] = " ";
            };
        };
        markCounts.X = 0;
        markCounts.O = 0;
    };

    return {
        getGridTile,
        getAllGridTiles,
        markTile,
        getMarkCount,
        incrementMarkCount,
        print,
        reset,
    };
})();

const Game = (function () {
    let currentPlayer = {};
    let roundNumber = 1;
    let roundFirstPlayer = {};
    const winningPatterns = [
        [[0,0], [0,1], [0,2]],
        [[1,0], [1,1], [1,2]],
        [[2,0], [2,1], [2,2]],
        [[0,0], [1,0], [2,0]],
        [[0,1], [1,1], [2,1]],
        [[0,2], [1,2], [2,2]],
        [[0,0], [1,1], [2,2]],
        [[0,2], [1,1], [2,0]],
    ];
    const winMoves = [
        [0,0],
        [0,2],
        [2,2],
        [1,1],
        [2,0],
        [1,0],
        [2,1],
    ];
    const tieMoves = [
        [0,0],
        [0,1],
        [0,2],
        [1,1],
        [1,0],
        [1,2],
        [2,1],
        [2,0],
        [2,2],
    ];

    const getCurrentPlayer = () => {
        return currentPlayer;
    };
    const setCurrentPlayer = (newCurrentPlayer) => {
        currentPlayer = newCurrentPlayer;
    };
    const swapCurrentPlayer = () => {
        if (currentPlayer === playerOne) {
            setCurrentPlayer(playerTwo);
        } else if (currentPlayer === playerTwo) {
            setCurrentPlayer(playerOne);
        };
    };
    const getRoundFirstPlayer = () => {
        return roundFirstPlayer;
    };
    const setRoundFirstPlayer = (newRoundFirstPlayer) => {
        roundFirstPlayer = newRoundFirstPlayer;
    };
    const swapRoundFirstPlayer = () => {
        if (roundFirstPlayer === playerOne) {
            setRoundFirstPlayer(playerTwo);
        } else if (roundFirstPlayer === playerTwo) {
            setRoundFirstPlayer(playerOne);
        };
    }
    const checkForWin = (player) => {
        let playerMark = player.mark;
        let won = false;
        let tied = false;
        let playerMarkCount = GameBoard.getMarkCount(playerMark)
        if (playerMarkCount >= 3) {
            gridTiles = GameBoard.getAllGridTiles();
            for (let i = 0; i < winningPatterns.length; i++) {
                let pattern = winningPatterns[i];
                let matches = 0;
                for (let j = 0; j < pattern.length; j++) {
                    let rowNum = pattern[j][0];
                    let colNum = pattern[j][1];
                    let tile = GameBoard.getGridTile(rowNum, colNum);
                    if (tile === playerMark) {
                        matches += 1;
                    };
                };
                if (matches === 3) {
                    won = true;
                    break;
                };
            };
            if (won === false) {
                tied = checkForTie();
            };
        };
        return {won, tied};
    };
    const checkForTie = () => {
        let xCount = GameBoard.getMarkCount("X");
        let oCount = GameBoard.getMarkCount("O");
        let markTotal = xCount + oCount;
        if (markTotal === 9) {
            return true;
        } else {
            return false;
        };
    };
    const printScore = () => {
        console.log(`--== SCORE ==--`);
        console.log(`${playerOne.getName()}: ${playerOne.getScore()}`);
        console.log(`${playerTwo.getName()}: ${playerTwo.getScore()}`);
    };
    const win = (winningPlayer) => {
        winningPlayer.incrementScore();
        DisplayController.updateScores();
        console.log(`${winningPlayer.getName()} won!`);
        printScore();
        GameBoard.reset();
        GameBoard.print();
        incrementRoundNumber();
        printRoundNumber();
        swapRoundFirstPlayer();
        setCurrentPlayer(roundFirstPlayer);
    };
    const tie = () => {
        console.log(`It's a tie! Neither player wins.`);
        printScore();
        GameBoard.reset();
        GameBoard.print();
        incrementRoundNumber();
        printRoundNumber();
        swapRoundFirstPlayer();
        setCurrentPlayer(roundFirstPlayer);
    };
    const takeTurn = (rowNum, colNum) => {
        let playerMark = currentPlayer.mark;
        let markResult = GameBoard.markTile(rowNum, colNum, playerMark);
        if (markResult === "valid") {
            GameBoard.incrementMarkCount(playerMark);
            GameBoard.print();
            let turnResult = checkForWin(currentPlayer);
            if (turnResult.won === false && turnResult.tied === false) {
                swapCurrentPlayer();
            } else if (turnResult.won === true && turnResult.tied === false) {
                win(currentPlayer);
            } else if (turnResult.won === false && turnResult.tied === true) {
                tie();
            } else if (turnResult.won, turnResult.tied === true) {
                console.log(`${currentPlayer.getName()} won and both players tied? Your code has an issue.`);
                GameBoard.reset();
                GameBoard.print();
            };
        } else if (markResult === "invalid") {
            console.log("That space is already occupied. Please select a different space.")
        };
    };
    const incrementRoundNumber = () => {
        roundNumber += 1;
    };
    const printRoundNumber = () => {
        console.log(`   -= ROUND ${roundNumber} =-`);
    };
    const testWin = () => {
        for (let i = 0; i < winMoves.length; i++) {
            takeTurn(winMoves[i][0], winMoves[i][1]);
        };
    };
    const testTie = () => {
        for (let i = 0; i < tieMoves.length; i++) {
            takeTurn(tieMoves[i][0], tieMoves[i][1]);
        };
    };

    return {
        getCurrentPlayer,
        setCurrentPlayer,
        swapCurrentPlayer,
        getRoundFirstPlayer,
        setRoundFirstPlayer,
        checkForWin,
        printScore,
        printRoundNumber,
        takeTurn,
        testWin,
        testTie,
    };
})();

const DisplayController = (function () {
    const elements = {
        scoreContainer: document.getElementById('score-container'),
        p1Name: document.getElementById('p1-name'),
        p1Score: document.getElementById('p1-score'),
        p2Name: document.getElementById('p2-name'),
        p2Score: document.getElementById('p2-score'),
        gridContainer: document.getElementById('grid-container'),
    };

    const changeText = (elementName, newText) => {
        elements[elementName].textContent = newText;
    };
    const updateNames = () => {
        changeText('p1Name', playerOne.getName());
        changeText('p2Name', playerTwo.getName());
    };
    const updateScores = () => {
        changeText('p1Score', playerOne.getScore());
        changeText('p2Score', playerTwo.getScore());
    };

    return {
        elements,
        changeText,
        updateNames,
        updateScores,
    };
})();

const PlayerFactory = (playerName, playerMark) => {
    const displayName = playerName;
    let score = 0;
    const mark = playerMark;

    const getName = () => {
        return displayName;
    };
    const getScore = () => {
        return score;
    };
    const incrementScore = () => {
        score += 1;
    };

    return {
        mark,
        getName,
        getScore,
        incrementScore,
    };
};

const playerOne = PlayerFactory("Josh", "X");
const playerTwo = PlayerFactory("Hopey", "O");
Game.setCurrentPlayer(playerOne);
Game.setRoundFirstPlayer(playerOne);
Game.printRoundNumber();
GameBoard.print();

DisplayController.updateNames();
DisplayController.updateScores();


