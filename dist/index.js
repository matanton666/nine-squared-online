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
    const board = document.getElementById("board");
    for (let i = 0; i < MEGA_SIZE; i++) {
        for (let j = 0; j < MEGA_SIZE; j++) {
            const newButton = document.createElement("button");
            newButton.innerText = count.toString();
            newButton.id = count.toString();
            newButton.className = "button";
            board.appendChild(newButton);
            count++;
        }
        board.appendChild(document.createElement("br"));
    }
}
