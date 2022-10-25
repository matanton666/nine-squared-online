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

    // create button element and set its parameters
    constructor(id: string, element: HTMLButtonElement) {
        this.id = id;
        this.ocupence = Player.none;
        this.element = element;
        // set element settings
        this.element.innerText = this.ocupence;
        this.element.id = this.id;
        this.element.className = "button";
        this.setOnclick();
    }

    public setOcupence(player: Player) {
            this.ocupence = player;
            this.element.innerText = this.ocupence;
    }

    // set the player to be set in a button when clicked
    private setOnclick() {
        this.element.onclick = () => {
            if (this.ocupence === Player.none) {
                this.setOcupence(currentTurn);
                // after turn checks
                afterTurn(this.element);
                // change turn
                
            }
        }
    }
}

// mini board containing buttons of places 
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
        // set element settings
        this.element.id = this.id;
        this.element.className = "mini-board";
        this.element.style.borderSpacing = "0";
        this.element.style.padding = "0";
    }
}



/**
 * creates the game board of one big table with 9 mini tables in it
 * each mini table has 9 buttons in it
 * @returns mega board containing mini boards containing buttons
 */
function createBoard(): IMegaBoard {
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

/**
 * adds black borders to the board to make it look like a tic tac toe board
 * @param boards array of mini boards
 */
function addBorders(boards: MiniBoard[]): void {
    const rightBorder = [0, 1, 3, 4, 6, 7];
    const bottomBorder = [0, 1, 2, 3, 4, 5];
    const leftBorder = [1, 2, 4, 5, 7, 8];
    const topBorder = [3, 4, 5, 6, 7, 8];
    const settings = "4px solid black";
    const miniSettings = "1px solid black";

    // loop all lists and set borders for every mini board
    for(let i = 0; i < boards.length; i++){
        for (const boardNum of rightBorder) {// loop every place that needs a right border
            boards[boardNum].element.style.borderRight = settings;
            boards[i].buttons[boardNum].element.style.borderRight = miniSettings;
        }
        for (const boardNum of leftBorder) { // etec
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

/*
// sets the player that is put when clicking a button
const setTurn = (boards: MiniBoard[], player: Player) => {
    document.getElementById("turn")!.innerText = player + "'s turn";
    boards.forEach(board => {
        board.buttons.forEach(btn => {
            btn.setOnclick() }) 
        });
}
*/

function afterTurn(element: HTMLButtonElement): Player{
    element.disabled = true;


    currentTurn = currentTurn === Player.X ? Player.O : Player.X;
    document.getElementById("turn")!.innerText = currentTurn + " turn";
    return megaBoard.winner;
}


// main 
var currentTurn = Player.X;
const megaBoard = createBoard();
addBorders(megaBoard.boards);

// TODO: add color red for x and blue for o
// TODO: add button for new game