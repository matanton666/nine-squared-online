import * as classes from "./classes.js";
const MEGA_SIZE = 9;
const randomBoard = () => {
    let rand = 0;
    do {
        rand = Math.floor(Math.random() * MEGA_SIZE);
    } while (allFullBtn(megaBoard.boards[rand].buttons));
    return rand;
};
function disableMiniBoardsByButton(id) {
    megaBoard.disableAllButtons();
    id = id.split("-")[1];
    let playingBoard = megaBoard.boards[parseInt(id)];
    if (allFullBtn(playingBoard.buttons)) {
        playingBoard = megaBoard.boards[randomBoard()];
    }
    playingBoard.setImageInvisable();
    playingBoard.buttons.forEach(button => {
        if (button.ocupence === classes.Player.none) {
            button.element.disabled = false;
        }
    });
}
const allEqualMini = (arr) => arr.every(v => v.winner === arr[0].winner && v.winner !== classes.Player.none && v.winner !== classes.Player.tie);
const allEqualButton = (arr) => arr.every(v => typeof v !== "undefined" && v.ocupence === arr[0].ocupence && v.ocupence !== classes.Player.none);
const allFullBtn = (arr) => arr.every(v => v.ocupence !== classes.Player.none);
const allFullMini = (arr) => arr.every(v => v.winner !== classes.Player.none);
const checkMiniBoards = (all) => {
    for (const list of all) {
        if (allEqualMini(list)) {
            return list[0].winner;
        }
    }
    return classes.Player.none;
};
const checkButtons = (all) => {
    for (const list of all) {
        if (allEqualButton(list)) {
            return list[0].ocupence;
        }
    }
    return classes.Player.none;
};
function checkBoardWin(board) {
    let col1 = [], col2 = [], col3 = [], diag1 = [], diag2 = [], row1 = [], row2 = [], row3 = [];
    let winner = classes.Player.none;
    row1.push(board[0], board[3], board[6]);
    row2.push(board[1], board[4], board[7]);
    row3.push(board[2], board[5], board[8]);
    col1.push(board[0], board[1], board[2]);
    col2.push(board[3], board[4], board[5]);
    col3.push(board[6], board[7], board[8]);
    diag1.push(board[0], board[4], board[8]);
    diag2.push(board[2], board[4], board[6]);
    let all = [col1, col2, col3, diag1, diag2, row1, row2, row3];
    if (board[0] instanceof classes.MiniBoard) {
        winner = checkMiniBoards(all);
        winner = winner === classes.Player.none ? allEqualMini(board) ? classes.Player.tie : winner : winner;
        return winner;
    }
    winner = checkButtons(all);
    winner = winner === classes.Player.none ? allFullBtn(board) ? classes.Player.tie : winner : winner;
    return winner;
}
function afterTurn(element, id, parentId) {
    element.disabled = true;
    const miniWin = checkBoardWin(megaBoard.boards[parentId].buttons);
    megaBoard.boards[parentId].winner = miniWin === classes.Player.none ? classes.Player.none : miniWin;
    megaBoard.boards[parentId].setImage(miniWin);
    megaBoard.winner = checkBoardWin(megaBoard.boards);
    if (megaBoard.winner !== classes.Player.none || allFullMini(megaBoard.boards)) {
        megaBoard.winner = megaBoard.winner === classes.Player.none ? classes.Player.tie : megaBoard.winner;
        megaBoard.showWinner();
        megaBoard.disableAllButtons();
        megaBoard.HilightAllMiniWin();
        return;
    }
    disableMiniBoardsByButton(id);
    globals.currentTurn = globals.currentTurn === classes.Player.X ? classes.Player.O : classes.Player.X;
    document.getElementById("turn").innerText = globals.currentTurn;
    document.getElementById("turn").style.color = globals.currentTurn === classes.Player.X ? "red" : "blue";
}
function simulateGame(speed) {
    let lastBoard = randomBoard();
    if (globals.inter)
        return;
    globals.inter = setInterval(() => {
        let btn;
        let rand2;
        do {
            rand2 = Math.floor(Math.random() * MEGA_SIZE);
            btn = megaBoard.boards[lastBoard].buttons[rand2];
        } while (btn.ocupence !== classes.Player.none && btn.element.disabled === true);
        btn.element.click();
        while (allFullBtn(megaBoard.boards[rand2].buttons)) {
            rand2 = randomBoard();
        }
        lastBoard = rand2;
        if (megaBoard.winner !== classes.Player.none) {
            clearInterval(globals.inter);
        }
    }, speed);
}
function setClickListeners(noSim = false) {
    document.getElementById("reset").addEventListener("click", () => {
        let out = megaBoard.reset(globals);
        setClickListeners();
    });
    if (!noSim) {
        document.getElementById("sim").addEventListener("click", () => {
            simulateGame(100);
        });
    }
    else {
        document.getElementById("sim").style.visibility = "hidden";
    }
    megaBoard.boards.forEach((board) => {
        board.buttons.forEach((button) => {
            button.setOnclick(globals, afterTurn);
            button.setOnhover(megaBoard);
        });
    });
}
function startGame(globals) {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId');
    if (gameId === "0") {
        setClickListeners();
    }
    else {
        const player = urlParams.get('player');
        console.log(gameId, player);
        if (gameId === null || player === null) {
            alert(`game with that code does not exist`);
            window.location.href = "/index.html";
            return;
        }
        globals.gameId = parseInt(gameId);
        setClickListeners(true);
        megaBoard.disableAllButtons();
    }
}
var globals = {
    currentTurn: classes.Player.X,
    inter: 0,
    gameId: 0
};
const megaBoard = new classes.MegaBoard(globals);
startGame(globals);
//# sourceMappingURL=index.js.map