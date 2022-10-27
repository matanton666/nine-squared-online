"use strict";
const MEGA_SIZE = 9;
const MINI_SIZE = 3;
const SEEN = 0.3;
var Player;
(function (Player) {
    Player["X"] = "X";
    Player["O"] = "O";
    Player["none"] = "-";
    Player["tie"] = "tie";
})(Player || (Player = {}));
class TicImage {
    constructor(id, element, type, opacity) {
        this.opacity = 0;
        this.position = -1;
        this.id = id;
        this.element = element;
        this.type = type;
        this.setOpacity(opacity);
        this.setPosition(-1);
    }
    setOpacity(opacity) {
        this.opacity = opacity;
        this.element.style.opacity = opacity.toString();
    }
    setPosition(position) {
        this.position = position;
        this.element.style.zIndex = position.toString();
    }
}
class Button {
    constructor(id, element, parent) {
        this.id = id;
        this.ocupence = Player.none;
        this.element = element;
        this.parentId = parent;
        this.element.innerText = this.ocupence;
        this.element.style.fontSize = "0px";
        this.element.id = this.id;
        this.element.className = "button";
        this.setOnclick();
    }
    setOcupence(player) {
        this.ocupence = player;
        this.element.innerText = this.ocupence;
        this.element.style.fontSize = "25px";
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
        this.element.style.borderCollapse = "collapse";
        this.image = this.createImage("", Player.none);
    }
    createButtons() {
        let count = 0;
        for (let l = 0; l < MINI_SIZE; l++) {
            const miniRow = document.createElement("tr");
            for (let m = 0; m < MINI_SIZE; m++) {
                const td = document.createElement("td");
                const btn = new Button(`button-${count}`, document.createElement("button"), parseInt(this.id));
                this.buttons.push(btn);
                td.appendChild(btn.element);
                miniRow.appendChild(td);
                count++;
            }
            this.element.appendChild(miniRow);
        }
    }
    createImage(path, typ) {
        const img = document.createElement("img");
        img.src = path;
        this.element.appendChild(img);
        return new TicImage(parseInt(this.id), img, typ, 0);
    }
    setImage(type) {
        if (type === Player.X) {
            this.image.element.src = "/images/x.png";
        }
        else if (type === Player.O) {
            this.image.element.src = "/images/o.png";
        }
        else if (type === Player.tie) {
            this.image.element.src = "/images/tie2.png";
        }
        this.image.type = type;
    }
    setImageVisable() {
        if (this.image.type !== Player.none) {
            this.image.setOpacity(SEEN);
            this.image.setPosition(1);
        }
    }
    setImageInvisable() {
        if (this.image.type !== Player.none) {
            this.image.setPosition(-1);
        }
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
            const miniBoard = new MiniBoard(`${j + i * MINI_SIZE}`, document.createElement("table"));
            miniBoard.createButtons();
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
    let rand = 0;
    do {
        rand = Math.floor(Math.random() * MEGA_SIZE);
    } while (allFullBtn(megaBoard.boards[rand].buttons));
    return rand;
};
const disableAllButtons = () => {
    megaBoard.boards.forEach(board => {
        board.setImageVisable();
        board.buttons.forEach(button => {
            button.element.disabled = true;
        });
    });
};
function disableMiniBoardsByButton(id) {
    disableAllButtons();
    id = id.split("-")[1];
    let playingBoard = megaBoard.boards[parseInt(id)];
    if (allFullBtn(playingBoard.buttons)) {
        playingBoard = megaBoard.boards[randomBoard()];
    }
    playingBoard.setImageInvisable();
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
        winner = checkMiniBoards(all);
        winner = winner === Player.none ? allEqualMini(board) ? Player.tie : winner : winner;
        return winner;
    }
    winner = checkButtons(all);
    winner = winner === Player.none ? allFullBtn(board) ? Player.tie : winner : winner;
    return winner;
}
const HilightAllMiniWin = () => {
    megaBoard.boards.forEach(board => {
        board.image.setOpacity(0.85);
    });
};
function afterTurn(element, id, parentId) {
    element.disabled = true;
    const miniWin = checkBoardWin(megaBoard.boards[parentId].buttons);
    megaBoard.boards[parentId].winner = miniWin === Player.none ? Player.none : miniWin;
    megaBoard.boards[parentId].setImage(miniWin);
    megaBoard.winner = checkBoardWin(megaBoard.boards);
    if (megaBoard.winner !== Player.none || allFullMini(megaBoard.boards)) {
        megaBoard.winner = megaBoard.winner === Player.none ? Player.tie : megaBoard.winner;
        document.getElementById("turn").innerText = megaBoard.winner !== Player.tie ?
            "payer " + megaBoard.winner + " won!" : "its a Tie!";
        disableAllButtons();
        HilightAllMiniWin();
        return megaBoard.winner;
    }
    disableMiniBoardsByButton(id);
    currentTurn = currentTurn === Player.X ? Player.O : Player.X;
    document.getElementById("turn").innerText = currentTurn + " turn";
    return megaBoard.winner;
}
function simulateGame(speed) {
    let lastBoard = randomBoard();
    let count = 0;
    const inter = setInterval(() => {
        let btn;
        let rand2;
        do {
            rand2 = Math.floor(Math.random() * MEGA_SIZE);
            btn = megaBoard.boards[lastBoard].buttons[rand2];
        } while (btn.ocupence !== Player.none && btn.element.disabled === true);
        btn.element.click();
        while (allFullBtn(megaBoard.boards[rand2].buttons)) {
            rand2 = randomBoard();
        }
        lastBoard = rand2;
        if (megaBoard.winner !== Player.none) {
            clearInterval(inter);
        }
        count++;
    }, speed);
}
var currentTurn = Player.X;
const megaBoard = createBoard();
addBorders(megaBoard.boards);
simulateGame(10);
//# sourceMappingURL=index.js.map