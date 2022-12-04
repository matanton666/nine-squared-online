const MINI_SIZE = 3;
const SEEN = 0.3;
export var Player;
(function (Player) {
    Player["X"] = "X";
    Player["O"] = "O";
    Player["none"] = "-";
    Player["tie"] = "tie";
})(Player || (Player = {}));
export class MegaBoard {
    constructor(globals) {
        this.disableAllButtons = () => {
            this.boards.forEach(board => {
                board.setImageVisable();
                board.element.style.boxShadow = "0px 0px 0px 0px #494949";
                board.element.style.scale = "1";
                board.buttons.forEach(button => {
                    button.element.disabled = true;
                });
            });
        };
        this.HilightAllMiniWin = () => {
            this.boards.forEach(board => {
                board.image.setOpacity(0.85);
            });
        };
        this.boards = [];
        this.winner = Player.none;
        this.reset(globals);
    }
    reset(globals) {
        if (this.boards.length !== 0)
            this.eraseBoards();
        if (globals.inter)
            clearInterval(globals.inter);
        globals.inter = 0;
        this.createBoard();
        this.addBorders(this.boards);
        this.winner = Player.none;
        globals.currentTurn = Player.X;
        document.getElementById("turn").innerText = "X";
        document.getElementById("turn").style.color = "red";
    }
    showWinner() {
        const text = document.getElementById("turn");
        text.innerText = this.winner !== Player.tie ?
            "player " + this.winner + " won!" : "its a Tie!";
        switch (this.winner) {
            case Player.O:
                text.style.color = "blue";
                break;
            case Player.X:
                text.style.color = "red";
                break;
            case Player.tie:
                text.style.color = "magenta";
                break;
            default:
                break;
        }
        text.style.fontSize = "xx-large";
    }
    eraseBoards() {
        this.boards.forEach(board => {
            board.buttons.forEach(button => {
                button.element.remove();
            });
            board.element.remove();
        });
        this.boards = [];
    }
    toJsonRepresentation() {
        let json = "[";
        for (let i = 0; i < this.boards.length; i++) {
            json += this.boards[i].toJsonRepresentation();
            if (i !== this.boards.length - 1)
                json += ",";
        }
        json += "]";
        return json;
    }
    fromJsonRepresentation(json) {
        const arr = JSON.parse(json);
        console.log(arr);
        for (let i = 0; i < MINI_SIZE; i++) {
            for (let j = 0; j < MINI_SIZE; j++) {
                this.boards[i * MINI_SIZE + j].winner = arr[i * MINI_SIZE + j].w;
                this.boards[i * MINI_SIZE + j].fromJsonRepresentation(JSON.stringify(arr[i * MINI_SIZE + j].btns));
            }
        }
    }
    createBoard() {
        let count = 0;
        const boardTable = document.getElementById("board");
        for (let i = 0; i < MINI_SIZE; i++) {
            const row = document.createElement("tr");
            for (let j = 0; j < MINI_SIZE; j++) {
                const col = document.createElement("td");
                const miniBoard = new MiniBoard(`${j + i * MINI_SIZE}`, document.createElement("table"));
                miniBoard.createButtons();
                col.appendChild(miniBoard.element);
                row.appendChild(col);
                this.boards.push(miniBoard);
            }
            boardTable.appendChild(row);
        }
    }
    addBorders(boards) {
        const rightBorder = [0, 1, 3, 4, 6, 7];
        const bottomBorder = [0, 1, 2, 3, 4, 5];
        const leftBorder = [1, 2, 4, 5, 7, 8];
        const topBorder = [3, 4, 5, 6, 7, 8];
        const settings = "4px solid black";
        const miniSettings = "1px solid black";
        for (let i = 0; i < boards.length; i++) {
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
            for (const boardNum of rightBorder) {
                boards[boardNum].element.style.borderRight = settings;
                boards[i].buttons[boardNum].element.style.borderRight = miniSettings;
            }
        }
    }
}
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
export class MiniBoard {
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
        if (this.image.type === Player.none) {
            if (type === Player.X) {
                this.image.element.src = "./images/x.png";
            }
            else if (type === Player.O) {
                this.image.element.src = "./images/o.png";
            }
            else if (type === Player.tie) {
                this.image.element.src = "./images/tie2.png";
            }
            this.image.type = type;
        }
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
    toJsonRepresentation() {
        let json = "{";
        json += `"w": "${this.winner}",`;
        json += `"btns": [`;
        for (let i = 0; i < this.buttons.length; i++) {
            json += this.buttons[i].toJsonRepresentation();
            if (i !== this.buttons.length - 1)
                json += ",";
        }
        json += `]}`;
        return json;
    }
    fromJsonRepresentation(json) {
        const obj = JSON.parse(json);
        this.setImage(this.winner);
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].fromJsonRepresentation(JSON.stringify(obj[i]));
        }
    }
}
export class Button {
    constructor(id, element, parent) {
        this.id = id;
        this.ocupence = Player.none;
        this.element = element;
        this.parentId = parent;
        this.element.innerText = this.ocupence;
        this.element.style.fontSize = "0px";
        this.element.id = this.id;
        this.element.className = "button";
    }
    setOcupence(player) {
        this.ocupence = player;
        this.element.innerText = this.ocupence;
        this.element.style.fontSize = "25px";
    }
    setOnclick(globals, afterTurn) {
        this.element.onclick = () => {
            if (this.ocupence === Player.none) {
                this.setOcupence(globals.currentTurn);
                afterTurn(this.element, this.id, this.parentId);
            }
        };
    }
    setOnhover(megaBoard) {
        this.element.onmouseover = () => {
            if (this.ocupence === Player.none) {
                const id = this.id.split("-")[1];
                let parent = megaBoard.boards[parseInt(id)];
                parent.element.style.boxShadow = "0px 0px 5px 5px #494949";
                parent.element.style.scale = "0.95";
            }
        };
        this.element.onmouseout = () => {
            if (this.ocupence === Player.none) {
                const id = this.id.split("-")[1];
                let parent = megaBoard.boards[parseInt(id)];
                parent.element.style.boxShadow = "0px 0px 0px 0px #494949";
                parent.element.style.scale = "1";
            }
        };
    }
    toJsonRepresentation() {
        return `{ "id": "${this.id.split("-")[1]}", "ocu": "${this.ocupence}" }`;
    }
    fromJsonRepresentation(json) {
        const obj = JSON.parse(json);
        this.id = "button-" + obj.id;
        this.ocupence = obj.ocu;
        this.ocupence == Player.none ? null : this.setOcupence(this.ocupence);
    }
}
//# sourceMappingURL=classes.js.map