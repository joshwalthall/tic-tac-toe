const GameBoard = (function () {
    const gridTiles = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];
    const symbolCounts = {
        X: 0,
        O: 0,
    };

    const getGridTile = (rowNum,colNum) => {
        return gridTiles[rowNum][colNum];
    };
    const getAllGridTiles = () => {
        return gridTiles;
    };
    const updateTile = (rowNum, colNum, symbol) => {
        if (gridTiles[rowNum][colNum] === " ") {
            gridTiles[rowNum][colNum] = symbol;
            return "valid";
        } else {
            return "invalid";
        };
    };
    const getSymbolCount = (symbol) => {
        return symbolCounts[symbol];
    };
    const incrementSymbolCount = (symbol) => {
        symbolCounts[symbol] += 1;
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
        print();
    };

    return {
        getGridTile,
        getAllGridTiles,
        updateTile,
        getSymbolCount,
        incrementSymbolCount,
        print,
        reset,
    };
})();


const Game = (function () {
    let currentPlayer = {};
    let roundNumber = 1;
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

    const getCurrentPlayer = () => {
        return currentPlayer;
    };
    const setCurrentPlayer = (newCurrentPlayer) => {
        currentPlayer = newCurrentPlayer;
    };
    const swapCurrentPlayer = () => {
        if (currentPlayer === playerOne) {
            currentPlayer = playerTwo;
        } else if (currentPlayer === playerTwo) {
            currentPlayer = playerOne;
        };
    };
    const placeSymbol = (rowNum, colNum) => {
        let playerSymbol = currentPlayer.symbol
        let updateResult = GameBoard.updateTile(rowNum, colNum, playerSymbol);
        if (updateResult === "valid") {
            GameBoard.incrementSymbolCount(playerSymbol);
            GameBoard.print();
            checkForWin(currentPlayer);
            swapCurrentPlayer();
        } else if (updateResult === "invalid") {
            console.log("That space is already occupied. Please select a different space.")
        };
    };
    const checkForWin = (player) => {
        let playerSymbol = player.symbol;
        if (GameBoard.getSymbolCount(playerSymbol) >= 3) {
            let winConditionMet = false;
            gridTiles = GameBoard.getAllGridTiles();
            for (let i = 0; i < winningPatterns.length; i++) {
                let pattern = winningPatterns[i];
                let matches = 0;
                for (let j = 0; j < pattern.length; j++) {
                    let rowNum = pattern[j][0];
                    let colNum = pattern[j][1];
                    let tile = GameBoard.getGridTile(rowNum, colNum);
                    if (tile === playerSymbol) {
                        matches += 1;
                    };
                };
                if (matches === 3) {
                    winConditionMet = true;
                    console.log(`${player.getName()} won!`);
                    return winConditionMet;
                };
            };
            checkForTie(winConditionMet);
            return winConditionMet;
        };
    };
    const checkForTie = (winConditionMet) => {
        let xCount = GameBoard.getSymbolCount("X");
            let oCount = GameBoard.getSymbolCount("O");
            let symbolTotal = xCount + oCount;
            if (symbolTotal === 9 && winConditionMet === false) {
                console.log(`It's a tie! Neither player wins.`);
            };
    };

    return {
        getCurrentPlayer,
        setCurrentPlayer,
        swapCurrentPlayer,
        placeSymbol,
        checkForWin,
    };
})();


const PlayerFactory = (playerName, playerSymbol) => {
    const displayName = playerName;
    let score = 0;
    const symbol = playerSymbol;

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
        symbol,
        getName,
        getScore,
        incrementScore,
    };
};


const playerOne = PlayerFactory("Player 1", "X");
const playerTwo = PlayerFactory("Player 2", "O");
Game.setCurrentPlayer(playerOne);
GameBoard.print();


