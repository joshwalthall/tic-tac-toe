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
        currentTiles = gridTiles;
        return currentTiles;
    };
    const updateGridTile = (rowNum, colNum, symbol) => {
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
    const printGameBoard = () => {
        console.log(`
         ${getGridTile(0,0)} │ ${getGridTile(0,1)} │ ${getGridTile(0,2)}
        ───┼───┼───
         ${getGridTile(1,0)} │ ${getGridTile(1,1)} │ ${getGridTile(1,2)}
        ───┼───┼───
         ${getGridTile(2,0)} │ ${getGridTile(2,1)} │ ${getGridTile(2,2)}
        `);
    };

    return {
        getGridTile,
        getAllGridTiles,
        updateGridTile,
        getSymbolCount,
        incrementSymbolCount,
        printGameBoard,
    };
})();


const Game = (function () {
    let currentPlayer = {};
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
        let updateResult = GameBoard.updateGridTile(rowNum, colNum, currentPlayer.symbol);
        if (updateResult === "valid") {
            GameBoard.printGameBoard();
            swapCurrentPlayer();
        } else if (updateResult === "invalid") {
            console.log("That space is already occupied. Please select a different space.")
        };
    };

    return {
        getCurrentPlayer,
        setCurrentPlayer,
        swapCurrentPlayer,
        placeSymbol,
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
GameBoard.printGameBoard();


