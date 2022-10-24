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
    board: MiniBoard[];
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
        board: [],
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
            const miniBoard = new MiniBoard(`mini-board-${count}`, document.createElement("table"));

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
            megaBoard.board.push(miniBoard);
        }
        boardTable.appendChild(row);
    }
    return megaBoard;
}

document.body.onload = addElements;


/**
 * function addElements() {
    let count = 0;
    const board = document.getElementById("board")!;// '!' to make sure not null
    // and give it some content
    for(let i = 0; i < MEGA_SIZE; i++){  
        for(let j = 0; j < MEGA_SIZE; j++){
            const newButton = document.createElement("button");
            newButton.innerText = count.toString();
            newButton.id = count.toString();
            newButton.className = "button"
            // add the text node to the newly created div
            board.appendChild(newButton);
            count++;
        }
        board.appendChild(document.createElement("br"));
    }
<tr>
            <td>
                <table>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                </table>
            </td>
            <td>
                <table>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                </table>
            </td>
            <td>
                <table>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                </table>
            </td>
            <td>
                <table>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                </table>
            </td>
            <td>
                <table>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                </table>
            </td>
            <td>
                <table>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                </table>
            </td>
            <td>
                <table>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                    <tr>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                        <td><button>asdf</button></td>
                    </tr>
                </table>
            </td>
        </tr>
 */