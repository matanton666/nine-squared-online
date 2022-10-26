const MEGA_SIZE = 9;
const MINI_SIZE = 3;


// ********* classes and interfaces *********

enum Player {
    X = "X",
    O = "O",
    none = "-",
    tie = "tie"
}

interface IButton {
    id: string;
    parentId: number;
    ocupence: Player;
    element: HTMLButtonElement;
}

interface IMegaBoard {
    boards: MiniBoard[];
    winner: Player;
}



class Button implements IButton {
    id: string;
    parentId: number;
    ocupence: Player;
    element: HTMLButtonElement;

    // create button element and set its parameters
    constructor(id: string, element: HTMLButtonElement, parent: number) {
        this.id = id;
        this.ocupence = Player.none;
        this.element = element;
        this.parentId = parent;
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
                afterTurn(this.element, this.id, this.parentId);
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


// ***** fucntions for board creation *****
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

            count = 0; // 1-9 buttons in mini board
            for(let l = 0; l < MINI_SIZE; l++){
                // every mini board row
                const miniRow = document.createElement("tr");

                for(let m = 0; m < MINI_SIZE; m++){
                    // every button in mini board 
                    const td = document.createElement("td");
                    const btn = new Button(`button-${count}`, document.createElement("button"), (j + i*MINI_SIZE));
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




// ***************************** fuctions for game logic *****************************

/**
 * gives a random number between 0 and 9 for a random mini board to be selected
 * @returns id of free mini board
 */
const randomBoard = (): number => {
    let rand = Math.floor(Math.random() * MEGA_SIZE);
    if (megaBoard.boards[rand].winner !== Player.none) {
        return randomBoard();
    }
    return rand;
}

/**
 * disables all buttons in the board except the one that can be played
 * @param id id of button that was clicked
 */
function disableMiniBoardsByButton(id: string){
    // disable all mini boards buttons
    megaBoard.boards.forEach(board => {
        board.buttons.forEach(button => {
            button.element.disabled = true;
        });
    });

    id = id.split("-")[1]; // get rid of 'button-' part
    let playingBoard = megaBoard.boards[parseInt(id)]
    if (playingBoard.winner !== Player.none){ // board is full
        randomBoard();
    }

    playingBoard.buttons.forEach(button => { // enable buttons in playing board
        if (button.ocupence === Player.none) {
            button.element.disabled = false;
        }
    });

}

// ***** functions for checking winner in boards *****
// functions to determine if a player won in a row colomn or diagonal
const allEqualMini = (arr: MiniBoard[]) => arr.every(v => v.winner === arr[0].winner &&v.winner !== Player.none &&v.winner !== Player.tie); 
const allEqualbutton = (arr: Button[]) => arr.every(v => typeof v !== "undefined" && v.ocupence === arr[0].ocupence && v.ocupence !== Player.none); 

const allFullBtn = (arr: Button[]) => arr.every(v => v.ocupence !== Player.none);
const allFullMini = (arr: MiniBoard[]) => arr.every(v => v.winner !== Player.none);

const checkMiniBoards = (all: MiniBoard[][]): Player => {
    for (const list of all) {
        if (allEqualMini(list)){
            return list[0].winner;
        }
    }
    return Player.none;
}
const checkButtons = (all: Button[][]): Player => {
    for (const list of all) {
        if (allEqualbutton(list)){
            return list[0].ocupence;
        }
    }
    return Player.none;
}



function checkBoardWin(board: MiniBoard[] | Button[]): Player {
    let col1 = [], col2 = [], col3 = [], diag1 = [], diag2 = [], row1 = [], row2 = [], row3 = [];
    let winner = Player.none;
    // get all rows and colomns and diagonals to checks
    row1.push(board[0], board[3], board[6]);
    row2.push(board[1], board[4], board[7]);
    row3.push(board[2], board[5], board[8]);
    col1.push(board[0], board[1], board[2]);
    col2.push(board[3], board[4], board[5]);
    col3.push(board[6], board[7], board[8]);
    diag1.push(board[0], board[4], board[8]);
    diag2.push(board[2], board[4], board[6]);


    let all:any = [col1, col2, col3, diag1, diag2, row1, row2, row3];
    
    if (board[0] instanceof MiniBoard){
        // first check for a tie and then check if a player won (if player won on last move it will be a win)
        if (allFullMini(board as MiniBoard[])) winner = Player.tie; 
        winner = checkMiniBoards(all);
        return winner
    }
    // same here
    if (allFullBtn(board as Button[])) winner = Player.tie; 
    winner = checkButtons(all);
    return winner
}


function afterTurn(element: HTMLButtonElement, id: string, parentId: number): Player{
    element.disabled = true;
    // check if win in mini board
    const miniWin = checkBoardWin(megaBoard.boards[parentId].buttons);
    megaBoard.boards[parentId].winner = miniWin === Player.none ? Player.none : miniWin;
    console.log(megaBoard.boards[parentId]);
    // check if win in mega board
    megaBoard.winner = checkBoardWin(megaBoard.boards)
    if (megaBoard.winner !== Player.none){
        document.getElementById("turn")!.innerText = "payer won! " + megaBoard.winner;// TODO: make a proper win screen
    }
    // disable none usable mini boards according to the button pressed
    disableMiniBoardsByButton(id);

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