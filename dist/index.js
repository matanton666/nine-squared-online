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
    }
}
function addElements() {
    let count = 0;
    const boardTable = document.getElementById("board");
    const megaBoard = {
        board: [],
        winner: Player.none
    };
    for (let i = 0; i < MINI_SIZE; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < MINI_SIZE; j++) {
            const col = document.createElement("td");
            const miniBoard = new MiniBoard(`mini-board-${count}`, document.createElement("table"));
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
            megaBoard.board.push(miniBoard);
        }
        boardTable.appendChild(row);
    }
    return megaBoard;
}
document.body.onload = addElements;
