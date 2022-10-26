"use strict";
const MEGA_SIZE = 9;
const MINI_SIZE = 3;
var Player;
(function (Player) {
    Player["X"] = "X";
    Player["O"] = "O";
    Player["none"] = "-";
    Player["tie"] = "tie";
})(Player || (Player = {}));
class Button {
    constructor(id, element, parent) {
        this.id = id;
        this.ocupence = Player.none;
        this.element = element;
        this.parentId = parent;
        this.element.innerText = this.ocupence;
        this.element.id = this.id;
        this.element.className = "button";
        this.setOnclick();
    }
    setOcupence(player) {
        this.ocupence = player;
        this.element.innerText = this.ocupence;
    }
    setOnclick() {
        this.element.onclick = () => {
            if (this.ocupence === Player.none) {
                this.setOcupence(currentTurn);
                afterTurn(this.element, this.id, this.parentId);
            }
        };
    }
}
class MiniBoard {
    constructor(id, element) {
        this.id = id;
        this.buttons = [];
        this.element = element;
        this.winner = Player.none;
        this.element.id = this.id;
        this.element.className = "mini-board";
        this.element.style.borderSpacing = "0";
        this.element.style.padding = "0";
    }
}
function createBoard() {
    let count = 0;
    const boardTable = document.getElementById("board");
    const megaBoard = {
        boards: [],
        winner: Player.none
    };
    for (let i = 0; i < MINI_SIZE; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < MINI_SIZE; j++) {
            const col = document.createElement("td");
            const miniBoard = new MiniBoard(`mini-board-${j + i * MINI_SIZE}`, document.createElement("table"));
            count = 0;
            for (let l = 0; l < MINI_SIZE; l++) {
                const miniRow = document.createElement("tr");
                for (let m = 0; m < MINI_SIZE; m++) {
                    const td = document.createElement("td");
                    const btn = new Button(`button-${count}`, document.createElement("button"), (j + i * MINI_SIZE));
                    miniBoard.buttons.push(btn);
                    td.appendChild(btn.element);
                    miniRow.appendChild(td);
                    count++;
                }
                miniBoard.element.appendChild(miniRow);
            }
            col.appendChild(miniBoard.element);
            row.appendChild(col);
            megaBoard.boards.push(miniBoard);
        }
        boardTable.appendChild(row);
    }
    return megaBoard;
}
function addBorders(boards) {
    const rightBorder = [0, 1, 3, 4, 6, 7];
    const bottomBorder = [0, 1, 2, 3, 4, 5];
    const leftBorder = [1, 2, 4, 5, 7, 8];
    const topBorder = [3, 4, 5, 6, 7, 8];
    const settings = "4px solid black";
    const miniSettings = "1px solid black";
    for (let i = 0; i < boards.length; i++) {
        for (const boardNum of rightBorder) {
            boards[boardNum].element.style.borderRight = settings;
            boards[i].buttons[boardNum].element.style.borderRight = miniSettings;
        }
        for (const boardNum of leftBorder) {
            boards[boardNum].element.style.borderLeft = settings;
            boards[i].buttons[boardNum].element.style.borderLeft = miniSettings;
        }
        for (const boardNum of topBorder) {
            boards[boardNum].element.style.borderTop = settings;
            boards[i].buttons[boardNum].element.style.borderTop = miniSettings;
        }
        for (const boardNum of bottomBorder) {
            boards[boardNum].element.style.borderBottom = settings;
            boards[i].buttons[boardNum].element.style.borderBottom = miniSettings;
        }
    }
}
const randomBoard = () => {
    let rand = Math.floor(Math.random() * MEGA_SIZE);
    if (allFullBtn(megaBoard.boards[rand].buttons)) {
        return randomBoard();
    }
    return rand;
};
function disableMiniBoardsByButton(id) {
    megaBoard.boards.forEach(board => {
        board.buttons.forEach(button => {
            button.element.disabled = true;
        });
    });
    id = id.split("-")[1];
    let playingBoard = megaBoard.boards[parseInt(id)];
    if (allFullBtn(playingBoard.buttons)) {
        playingBoard = megaBoard.boards[randomBoard()];
    }
    playingBoard.buttons.forEach(button => {
        if (button.ocupence === Player.none) {
            button.element.disabled = false;
        }
    });
}
const allEqualMini = (arr) => arr.every(v => v.winner === arr[0].winner && v.winner !== Player.none && v.winner !== Player.tie);
const allEqualbutton = (arr) => arr.every(v => typeof v !== "undefined" && v.ocupence === arr[0].ocupence && v.ocupence !== Player.none);
const allFullBtn = (arr) => arr.every(v => v.ocupence !== Player.none);
const allFullMini = (arr) => arr.every(v => v.winner !== Player.none);
const checkMiniBoards = (all) => {
    for (const list of all) {
        if (allEqualMini(list)) {
            return list[0].winner;
        }
    }
    return Player.none;
};
const checkButtons = (all) => {
    for (const list of all) {
        if (allEqualbutton(list)) {
            return list[0].ocupence;
        }
    }
    return Player.none;
};
function checkBoardWin(board) {
    let col1 = [], col2 = [], col3 = [], diag1 = [], diag2 = [], row1 = [], row2 = [], row3 = [];
    let winner = Player.none;
    row1.push(board[0], board[3], board[6]);
    row2.push(board[1], board[4], board[7]);
    row3.push(board[2], board[5], board[8]);
    col1.push(board[0], board[1], board[2]);
    col2.push(board[3], board[4], board[5]);
    col3.push(board[6], board[7], board[8]);
    diag1.push(board[0], board[4], board[8]);
    diag2.push(board[2], board[4], board[6]);
    let all = [col1, col2, col3, diag1, diag2, row1, row2, row3];
    if (board[0] instanceof MiniBoard) {
        if (allFullMini(board))
            winner = Player.tie;
        winner = checkMiniBoards(all);
        return winner;
    }
    if (allFullBtn(board))
        winner = Player.tie;
    winner = checkButtons(all);
    return winner;
}
function afterTurn(element, id, parentId) {
    element.disabled = true;
    const miniWin = checkBoardWin(megaBoard.boards[parentId].buttons);
    megaBoard.boards[parentId].winner = miniWin === Player.none ? Player.none : miniWin;
    megaBoard.winner = checkBoardWin(megaBoard.boards);
    if (megaBoard.winner !== Player.none) {
        document.getElementById("turn").innerText = "payer won! " + megaBoard.winner;
        return megaBoard.winner;
    }
    disableMiniBoardsByButton(id);
    currentTurn = currentTurn === Player.X ? Player.O : Player.X;
    document.getElementById("turn").innerText = currentTurn + " turn";
    return megaBoard.winner;
}
function simulateGame(speed) {
    let lastBoard = randomBoard();
    setInterval(() => {
        let rand2 = Math.floor(Math.random() * MEGA_SIZE);
        if (megaBoard.boards[lastBoard].buttons[rand2].ocupence === Player.none) {
            megaBoard.boards[lastBoard].buttons[rand2].element.click();
            lastBoard = rand2;
        }
    }, speed);
}
var currentTurn = Player.X;
const megaBoard = createBoard();
addBorders(megaBoard.boards);
//# sourceMappingURL=index.js.map