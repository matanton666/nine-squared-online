const MEGA_SIZE = 9;
const MINI_SIZE = 3;
const SEEN = 0.3;

// TODO: comment and clean
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

class MegaBoard {
    boards: MiniBoard[];
    winner: Player;

    constructor() {
        this.boards = [];
        this.winner = Player.none;
        this.reset();
    }

    public reset(): void {
        if (this.boards.length !== 0) 
            this.eraseBoards(); // remove boards if they exist
        if (inter) clearInterval(inter); // remove interval if it exists
        this.createBoard();
        this.addBorders(this.boards);
        this.winner = Player.none;
        currentTurn = Player.X;
        document.getElementById("turn")!.innerText = "X turn";
    }

    private eraseBoards(): void {
        this.boards.forEach(board => {
            board.buttons.forEach(button => {
                button.element.remove();
            });
            board.element.remove();
        });
        this.boards = [];
    }

    public showWinner(): void {
        const text = document.getElementById("turn")!;
        text.innerText =  this.winner !== Player.tie ?
        "player " + megaBoard.winner + " won!" : "its a Tie!";
        // change color of text based on the winner
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

    /**
     * creates the game board of one big table with 9 mini tables in it
     * each mini table has 9 buttons in it
     * @returns mega board containing mini boards containing buttons
     */
    private createBoard() {
        let count = 0;
        const boardTable = document.getElementById("board")!;// '!' to make sure not null
        // loop to create table with buttons
        for(let i = 0; i < MINI_SIZE; i++){
            // every mega board row
            const row = document.createElement("tr");

            for(let j = 0; j < MINI_SIZE; j++){
                // every mega board data cell
                const col = document.createElement("td");
                // every mini board table element
                const miniBoard = new MiniBoard(`${j + i*MINI_SIZE}`, document.createElement("table"));
                miniBoard.createButtons();
    
                col.appendChild(miniBoard.element);
                row.appendChild(col);
                this.boards.push(miniBoard);
            }
            boardTable.appendChild(row);
        }
    }

    /**
     * adds black borders to the board to make it look like a tic tac toe board
     * @param boards array of mini boards
     */
    private addBorders(boards: MiniBoard[]): void {
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
}


class TicImage {
    id: number;
    element: HTMLImageElement;
    type: Player;
    opacity: number = 0;
    position: number = -1;

    constructor(id: number, element: HTMLImageElement, type: Player, opacity: number) {
        this.id = id;
        this.element = element;
        this.type = type;
        this.setOpacity(opacity);
        this.setPosition(-1);
    }

    public setOpacity(opacity: number) {
        this.opacity = opacity;
        this.element.style.opacity = opacity.toString();
    }

    // 1 for front, -1 for back
    public setPosition(position: number) {
        this.position = position;
        this.element.style.zIndex = position.toString();
    }
}


// mini board containing buttons of places 
class MiniBoard {
    id: string;
    buttons: Button[];
    element: HTMLTableElement;
    winner: Player;
    image: TicImage;

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
        this.element.style.borderCollapse = "collapse";
        
        this.image = this.createImage("", Player.none);
    }

    // create buttons and add them to the mini board
    public createButtons() {
        let count = 0; // 1-9 buttons in mini board
        for(let l = 0; l < MINI_SIZE; l++){
            // every mini board row
            const miniRow = document.createElement("tr");

            for(let m = 0; m < MINI_SIZE; m++){
                // every button in mini board 
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

    // create the images on top of the mini board for x and o
    private createImage(path: string, typ: Player): TicImage {

        const img = document.createElement("img");
        img.src = path;
        // position the image in the middle of the mini board
        this.element.appendChild(img);

        return new TicImage(parseInt(this.id), img, typ, 0);
    }

    // set image to be visible
    public setImage(type: Player) {
        if (type === Player.X) {
            this.image.element.src = "/images/x.png";
        } else if (type === Player.O) {
            this.image.element.src = "/images/o.png";
        } else if (type === Player.tie) {
            this.image.element.src = "/images/tie2.png";
        }
        this.image.type = type;
    }

    public setImageVisable() {
        if (this.image.type !== Player.none) {
            this.image.setOpacity(SEEN);
            this.image.setPosition(1);
        }
    }

    public setImageInvisable() {
        if (this.image.type !== Player.none) {
            this.image.setPosition(-1);
        }
    }
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
        this.element.style.fontSize = "0px";
        this.element.id = this.id;
        this.element.className = "button";
        this.setOnclick();
        this.setOnhover();
    }

    public setOcupence(player: Player) {
            this.ocupence = player;
            this.element.innerText = this.ocupence;
            this.element.style.fontSize = "25px";
    }

    // set the player to be set in a button when clicked
    private setOnclick() {
        this.element.onclick = () => {
            if (this.ocupence === Player.none) {
                this.setOcupence(currentTurn);
                // after turn checks
                afterTurn(this.element, this.id, this.parentId);
            }
        }
    }

    private setOnhover() {
        this.element.onmouseover = () =>{
            if (this.ocupence === Player.none) {
                // highlight the mini board that coresponds to the button hovered
                const id = this.id.split("-")[1];
                let stl = megaBoard.boards[parseInt(id)].element.style;
                stl.boxShadow = "0px 0px 5px 5px #494949";
                stl.scale = "0.98";
                
            }
        }
        this.element.onmouseout = () =>{
            // revert to normal
            if (this.ocupence === Player.none) {
                const id = this.id.split("-")[1];
                let stl = megaBoard.boards[parseInt(id)].element.style;
                stl.boxShadow = "0px 0px 0px 0px #494949";
                stl.scale = "1";
            }
        }
    }
}



// ***************************** fuctions for game logic *****************************


/**
 * gives a random number between 0 and 9 for a random mini board to be selected
 * @returns id of free mini board
 */
const randomBoard = (): number => {
    let rand = 0;
    do{
    rand = Math.floor(Math.random() * MEGA_SIZE);
    }
    while (allFullBtn(megaBoard.boards[rand].buttons));
    return rand;
}
//TODO: move this to mega board class
const disableAllButtons = () => {
    // disable all mini boards buttons
    megaBoard.boards.forEach(board => {
        board.setImageVisable();
        board.element.style.boxShadow = "0px 0px 0px 0px #494949";
        board.element.style.scale = "1";
        board.buttons.forEach(button => {
            button.element.disabled = true;
        });
    });
}

/**
 * disables all buttons in the board except the one that can be played
 * @param id id of button that was clicked
 */
function disableMiniBoardsByButton(id: string){

    disableAllButtons();

    id = id.split("-")[1]; // get rid of 'button-' part
    let playingBoard = megaBoard.boards[parseInt(id)]
    if (allFullBtn(playingBoard.buttons)){ // board is full
        playingBoard = megaBoard.boards[randomBoard()];
    } 

    playingBoard.setImageInvisable();
    playingBoard.buttons.forEach(button => { // enable buttons in playing board
        if (button.ocupence === Player.none) {
            button.element.disabled = false;
        }
    });

}

// ********* functions for checking winner in boards *********


// functions to determine if a player won in a row colomn or diagonal
const allEqualMini = (arr: MiniBoard[]) => arr.every(v => v.winner === arr[0].winner &&v.winner !== Player.none &&v.winner !== Player.tie); 
const allEqualbutton = (arr: Button[]) => arr.every(v => typeof v !== "undefined" && v.ocupence === arr[0].ocupence && v.ocupence !== Player.none); 

// return true if there are no none elements
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
        winner = checkMiniBoards(all);
        winner = winner === Player.none ? allEqualMini(board as MiniBoard[]) ? Player.tie : winner : winner;
        return winner
    }
    // same here
    winner = checkButtons(all);
    winner = winner === Player.none ? allFullBtn(board as Button[]) ? Player.tie : winner : winner;
    return winner
}


const HilightAllMiniWin = () =>{
    megaBoard.boards.forEach(board => {
        board.image.setOpacity(0.85);
    });
}

function afterTurn(element: HTMLButtonElement, id: string, parentId: number): Player{
    element.disabled = true;
    // check if win in mini board
    const miniWin = checkBoardWin(megaBoard.boards[parentId].buttons);
    megaBoard.boards[parentId].winner = miniWin === Player.none ? Player.none : miniWin;
    megaBoard.boards[parentId].setImage(miniWin);
    
    // check if win in mega board
    megaBoard.winner = checkBoardWin(megaBoard.boards)
    if (megaBoard.winner !== Player.none || allFullMini(megaBoard.boards)){
        // all full mini checks if the game is a tie and then here set the winner to tie if it is
        megaBoard.winner = megaBoard.winner === Player.none ? Player.tie : megaBoard.winner;
        megaBoard.showWinner();
        disableAllButtons();
        HilightAllMiniWin();
        return megaBoard.winner;
    }

    // disable none usable mini boards according to the button pressed
    disableMiniBoardsByButton(id);
    
    currentTurn = currentTurn === Player.X ? Player.O : Player.X;
    document.getElementById("turn")!.innerText = currentTurn + " turn";
    return megaBoard.winner;
}



// test the game by setting an interval to emulate a player that plays random moves
function simulateGame(speed: number){
    let lastBoard = randomBoard();
    let count = 0;
    inter = setInterval(() => {
        let btn;
        let rand2;
        do{
            rand2 = Math.floor(Math.random() * MEGA_SIZE);
            btn = megaBoard.boards[lastBoard].buttons[rand2];
        }
        while (btn.ocupence !== Player.none && btn.element.disabled === true);

        btn.element.click();
        while (allFullBtn(megaBoard.boards[rand2].buttons)){
            rand2 = randomBoard();
        }
        lastBoard = rand2;
        if(megaBoard.winner !== Player.none) {
            clearInterval(inter);
        }
        count++;
    }, speed);
}


// main 
var inter: number;
var currentTurn = Player.X;
const megaBoard = new MegaBoard();

// simulateGame(100);

// TODO: add color red for x and blue for o
// TODO: add button for new game