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


const PlayerFactory = (playerName, playerMark) => {
    let displayName = playerName;
    let score = 0;
    const mark = playerMark;

    const getName = () => {
        return displayName;
    };
    const setName = (newName) => {
        displayName = newName;
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
        setName,
        getScore,
        incrementScore,
    };
};


const Game = (function () {
    const nextRoundButton = document.getElementById('next-round-button');
    const endGameButton = document.getElementById('end-game-button');
    const changeNamesDialog = document.getElementById('change-names-dialog');
    const namesChangeForm = document.getElementById('names-change-form');
    const playerOneName = document.getElementById('player-one-name');
    const playerTwoName = document.getElementById('player-two-name');
    const saveNamesButton = document.getElementById('save-names-button');
    const cancelNamesButton = document.getElementById('cancel-names-button');

    const playerOne = PlayerFactory('Player One', 'X');
    const playerTwo = PlayerFactory('Player Two', 'O');
    let currentPlayer = {playerOne};
    let roundNumber = 1;
    let roundFirstPlayer = {playerOne};

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

    const addClickListeners = () => {
        for (row = 0; row < 3; row++) {
            for (col = 0; col < 3; col++) {
                let tile = DisplayController.tiles[row][col];
                tile.addEventListener('click', processTurnClick);
            };
        };
        cancelNamesButton.addEventListener('click', _cancelNamesChange);
        saveNamesButton.addEventListener('click', _saveNamesChange);
    };
    const _resetNameFields = () => {
        playerOneName.value = playerOne.getName();
        playerTwoName.value = playerTwo.getName();
    };
    const _showchangeNamesDialog = () => {
        _resetNameFields();
        changeNamesDialog.showModal();
    };
    const _cancelNamesChange = () => {
        changeNamesDialog.close();
    };
    const _saveNamesChange = (submitEvent) => {
        submitEvent.preventDefault();
        playerOne.setName(playerOneName.value);
        playerTwo.setName(playerTwoName.value);
        DisplayController.updateNames();
        changeNamesDialog.close();
    };
    const processTurnClick = (e) => {
        let tileID = e.target.id;
        let splitID = tileID.split('-');
        let tileRow = Number(splitID[1]);
        let tileCol = Number(splitID[2]);
        takeTurn(tileRow, tileCol);
    };
    const getCurrentPlayer = () => {
        return currentPlayer;
    };
    const setCurrentPlayer = (newCurrentPlayer) => {
        currentPlayer = newCurrentPlayer;
        DisplayController.changeElementText('gameMessage', `${currentPlayer.getName()}'s turn`);
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
        updateRoundNumber();
        swapRoundFirstPlayer();
        setCurrentPlayer(roundFirstPlayer);
    };
    const tie = () => {
        console.log(`It's a tie! Neither player wins.`);
        printScore();
        GameBoard.reset();
        GameBoard.print();
        incrementRoundNumber();
        updateRoundNumber();
        swapRoundFirstPlayer();
        setCurrentPlayer(roundFirstPlayer);
    };
    const takeTurn = (rowNum, colNum) => {
        let playerMark = currentPlayer.mark;
        let markResult = GameBoard.markTile(rowNum, colNum, playerMark);
        if (markResult === "valid") {
            GameBoard.incrementMarkCount(playerMark);
            DisplayController.changeTileMark(rowNum, colNum, playerMark);
            GameBoard.print();
            let turnResult = checkForWin(currentPlayer);
            if (turnResult.won === false && turnResult.tied === false) {
                swapCurrentPlayer();
            } else if (turnResult.won === true && turnResult.tied === false) {
                win(currentPlayer);
                DisplayController.clearTiles();
            } else if (turnResult.won === false && turnResult.tied === true) {
                DisplayController.clearTiles();
                tie();
            } else if (turnResult.won, turnResult.tied === true) {
                console.log(`${currentPlayer.getName()} won and both players tied? Your code has an issue.`);
                GameBoard.reset();
                GameBoard.print();
            };
        } else if (markResult === "invalid") {
            console.log("That space is already occupied. Please select a different space.");
            DisplayController.shakeTile(rowNum, colNum);
        };
    };
    const incrementRoundNumber = () => {
        roundNumber += 1;
    };
    const updateRoundNumber = () => {
        console.log(`   -= ROUND ${roundNumber} =-`);
        DisplayController.changeElementText('roundNumber', `Round ${roundNumber}`);
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
    const initialize = () => {
        addClickListeners();
        setCurrentPlayer(playerOne);
        setRoundFirstPlayer(playerOne);
        updateRoundNumber();
        _showchangeNamesDialog();
    };

    return {
        playerOne,
        playerTwo,
        getCurrentPlayer,
        setCurrentPlayer,
        swapCurrentPlayer,
        getRoundFirstPlayer,
        setRoundFirstPlayer,
        checkForWin,
        printScore,
        updateRoundNumber,
        takeTurn,
        testWin,
        testTie,
        initialize,
    };
})();


const DisplayController = (function () {
    const tile0_0 = document.getElementById("tile-0-0");
    const tile0_1 = document.getElementById("tile-0-1");
    const tile0_2 = document.getElementById("tile-0-2");
    const tile1_0 = document.getElementById("tile-1-0");
    const tile1_1 = document.getElementById("tile-1-1");
    const tile1_2 = document.getElementById("tile-1-2");
    const tile2_0 = document.getElementById("tile-2-0");
    const tile2_1 = document.getElementById("tile-2-1");
    const tile2_2 = document.getElementById("tile-2-2");

    const tiles = [
        [tile0_0, tile0_1, tile0_2],
        [tile1_0, tile1_1, tile1_2],
        [tile2_0, tile2_1, tile2_2]
    ];

    const elements = {
        scoreContainer: document.getElementById('score-container'),
        p1Name: document.getElementById('p1-name'),
        p1Score: document.getElementById('p1-score'),
        p2Name: document.getElementById('p2-name'),
        p2Score: document.getElementById('p2-score'),
        gridContainer: document.getElementById('grid-container'),
        clickDisplayer: document.getElementById('click-displayer'),
        roundNumber: document.getElementById('round-number'),
        gameMessage: document.getElementById('game-message'),
    };

    const changeTileMark = (rowNum, colNum, mark) => {
        tiles[rowNum][colNum].firstChild.textContent = mark;
    };
    const clearTiles = () => {
        for (row = 0; row < 3; row++) {
            for (col = 0; col < 3; col++) {
                changeTileMark(row, col, " ");
            };
        };
    };
    const changeElementText = (elementName, newText) => {
        elements[elementName].textContent = newText;
    };
    const _removeShakeAnim = (tileMark) => {
        tileMark.style.animation = "none";
        tileMark.offsetWidth;
    };
    const _addShakeAnim = (tileMark) => {
        tileMark.style.animation="shake 0.2s linear 1";
    };
    const shakeTile = (rowNum, colNum) => {
        let tileMark = DisplayController.tiles[rowNum][colNum].firstChild;
        _removeShakeAnim(tileMark);
        _addShakeAnim(tileMark);
    };
    const updateNames = () => {
        changeElementText('p1Name', Game.playerOne.getName());
        changeElementText('p2Name', Game.playerTwo.getName());
        changeElementText('gameMessage', `${Game.getCurrentPlayer().getName()}'s turn`);
    };
    const updateScores = () => {
        changeElementText('p1Score', Game.playerOne.getScore());
        changeElementText('p2Score', Game.playerTwo.getScore());
    };

    return {
        tiles,
        elements,
        changeTileMark,
        clearTiles,
        changeElementText,
        shakeTile,
        updateNames,
        updateScores,
    };
})();


Game.initialize();
GameBoard.print();

DisplayController.updateNames();
DisplayController.updateScores();


