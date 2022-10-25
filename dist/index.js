"use strict";
const MEGA_SIZE = 9;
const MINI_SIZE = 3;
var Player;
(function (Player) {
    Player["X"] = "X";
    Player["O"] = "O";
    Player["none"] = "-";
})(Player || (Player = {}));
class Button {
    constructor(id, element) {
        this.id = id;
        this.ocupence = Player.none;
        this.element = element;
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
                afterTurn(this.element);
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
                    const btn = new Button(`button-${count}`, document.createElement("button"));
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
function afterTurn(element) {
    element.disabled = true;
    currentTurn = currentTurn === Player.X ? Player.O : Player.X;
    document.getElementById("turn").innerText = currentTurn + " turn";
    return megaBoard.winner;
}
var currentTurn = Player.X;
const megaBoard = createBoard();
addBorders(megaBoard.boards);
//# sourceMappingURL=index.js.map