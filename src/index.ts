const MEGA_SIZE = 9;
const MINI_SIZE = 3;

enum Player {
    X = "X",
    O = "O",
    none = "-"
}

interface IButton {
    id: string;
    ocupence: Player;
    element: HTMLButtonElement;
}

interface IMegaBoard {
    boards: MiniBoard[];
    winner: Player;
}


class Button implements IButton {
    id: string;
    ocupence: Player;
    element: HTMLButtonElement;

    constructor(id: string, element: HTMLButtonElement) {
        this.id = id;
        this.ocupence = Player.none;
        this.element = element;

        this.element.innerText = this.ocupence;
        this.element.id = this.id;
        this.element.className = "button";
    }

    public setOcupence(player: Player) {
        this.ocupence = player;
        this.element.innerText = this.ocupence;
    }
}

class MiniBoard {
    id: string;
    buttons: Button[];
    element: HTMLTableElement;
    winner: Player;

    constructor(id: string, element: HTMLTableElement) {
        this.id = id;
        this.buttons = [];
        this.element = element;
        this.winner = Player.none;

        this.element.id = this.id;
        this.element.className = "mini-board";
    }
}




function addElements(): IMegaBoard {
    let count = 0;
    const boardTable = document.getElementById("board")!;// '!' to make sure not null
    const megaBoard: IMegaBoard = {
        boards: [],
        winner: Player.none
    };
    // loop to create table with buttons
    for(let i = 0; i < MINI_SIZE; i++){
        // every mega board row
        const row = document.createElement("tr");

        for(let j = 0; j < MINI_SIZE; j++){
            // every mega board data cell
            const col = document.createElement("td");
            // every mini board table element
            const miniBoard = new MiniBoard(`mini-board-${j + i*MINI_SIZE}`, document.createElement("table"));

            count = 0;
            for(let l = 0; l < MINI_SIZE; l++){
                // every mini board row
                const miniRow = document.createElement("tr");

                for(let m = 0; m < MINI_SIZE; m++){
                    // every button in mini board 
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


function createBorders(boards: MiniBoard[]): void {
    const rightBorder = [0, 1, 3, 4, 6, 7];
    const bottomBorder = [0, 1, 2, 3, 4, 5];
    const leftBorder = [1, 2, 4, 5, 7, 8];
    const topBorder = [3, 4, 5, 6, 7, 8];
    const settings = "5px solid black";

    for(let i = 0; i < boards.length; i++){
        for (const boardNum of rightBorder) {
            boards[boardNum].element.style.borderRight = settings;
            boards[i].buttons[boardNum].element.style.borderRight = settings;
        }
        for (const boardNum of leftBorder) {
            boards[boardNum].element.style.borderLeft = settings;
            boards[i].buttons[boardNum].element.style.borderLeft = settings;
        }
        for (const boardNum of topBorder) {
            boards[boardNum].element.style.borderTop = settings;
            boards[i].buttons[boardNum].element.style.borderTop = settings;
        }
        for (const boardNum of bottomBorder) {
            boards[boardNum].element.style.borderBottom = settings;
            boards[i].buttons[boardNum].element.style.borderBottom = settings;
        }
    }
}


const megaBoard = addElements();
createBorders(megaBoard.boards);
