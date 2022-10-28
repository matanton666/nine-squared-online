import * as classes from "./classes.js";

// TODO: clean code and comment 
// ***************************** fuctions for game logic *****************************
const MEGA_SIZE = 9;

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

/**
 * disables all buttons in the board except the one that can be played
 * @param id id of button that was clicked
 */
function disableMiniBoardsByButton(id: string){

    megaBoard.disableAllButtons();

    id = id.split("-")[1]; // get rid of 'button-' part
    let playingBoard = megaBoard.boards[parseInt(id)]
    if (allFullBtn(playingBoard.buttons)){ // board is full
        playingBoard = megaBoard.boards[randomBoard()];
    } 

    playingBoard.setImageInvisable();
    playingBoard.buttons.forEach(button => { // enable buttons in playing board
        if (button.ocupence === classes.Player.none) {
            button.element.disabled = false;
        }
    });

}

// ********* functions for checking winner in boards *********


// functions to determine if a player won in a row colomn or diagonal
const allEqualMini = (arr: classes.MiniBoard[]) => arr.every(v => v.winner === arr[0].winner &&v.winner !== classes.Player.none &&v.winner !== classes.Player.tie); 
const allEqualbutton = (arr: classes.Button[]) => arr.every(v => typeof v !== "undefined" && v.ocupence === arr[0].ocupence && v.ocupence !== classes.Player.none); 

// return true if there are no none elements
const allFullBtn = (arr: classes.Button[]) => arr.every(v => v.ocupence !== classes.Player.none);
const allFullMini = (arr: classes.MiniBoard[]) => arr.every(v => v.winner !== classes.Player.none);


const checkMiniBoards = (all: classes.MiniBoard[][]): classes.Player => {
    for (const list of all) {
        if (allEqualMini(list)){
            return list[0].winner;
        }
    }
    return classes.Player.none;
}
const checkButtons = (all: classes.Button[][]): classes.Player => {
    for (const list of all) {
        if (allEqualbutton(list)){
            return list[0].ocupence;
        }
    }
    return classes.Player.none;
}

function checkBoardWin(board: classes.MiniBoard[] | classes.Button[]): classes.Player {
    let col1 = [], col2 = [], col3 = [], diag1 = [], diag2 = [], row1 = [], row2 = [], row3 = [];
    let winner = classes.Player.none;
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
    
    if (board[0] instanceof classes.MiniBoard){
        // first check for a tie and then check if a player won (if player won on last move it will be a win)
        winner = checkMiniBoards(all);
        winner = winner === classes.Player.none ? allEqualMini(board as classes.MiniBoard[]) ? classes.Player.tie : winner : winner;
        return winner
    }
    // same here
    winner = checkButtons(all);
    winner = winner === classes.Player.none ? allFullBtn(board as classes.Button[]) ? classes.Player.tie : winner : winner;
    return winner
}



function afterTurn(element: HTMLButtonElement, id: string, parentId: number){
    element.disabled = true;
    // check if win in mini board
    const miniWin = checkBoardWin(megaBoard.boards[parentId].buttons);
    megaBoard.boards[parentId].winner = miniWin === classes.Player.none ? classes.Player.none : miniWin;
    megaBoard.boards[parentId].setImage(miniWin);
    
    // check if win in mega board
    megaBoard.winner = checkBoardWin(megaBoard.boards)
    if (megaBoard.winner !== classes.Player.none || allFullMini(megaBoard.boards)){
        // all full mini checks if the game is a tie and then here set the winner to tie if it is
        megaBoard.winner = megaBoard.winner === classes.Player.none ? classes.Player.tie : megaBoard.winner;
        megaBoard.showWinner();
        megaBoard.disableAllButtons();
        megaBoard.HilightAllMiniWin();
        return;
    }

    // disable none usable mini boards according to the button pressed
    disableMiniBoardsByButton(id);
    
    globals.currentTurn = globals.currentTurn === classes.Player.X ? classes.Player.O : classes.Player.X;
    document.getElementById("turn")!.innerText = globals.currentTurn;
    document.getElementById("turn")!.style.color = globals.currentTurn === classes.Player.X ? "red" : "blue";
}

// test the game by setting an interval to emulate a player that plays random moves
function simulateGame(speed: number){
    let lastBoard = randomBoard();
    if (globals.inter) return;
    globals.inter = setInterval(() => {
        let btn;
        let rand2;
        do{ // find a random button that is not taken
            rand2 = Math.floor(Math.random() * MEGA_SIZE);
            btn = megaBoard.boards[lastBoard].buttons[rand2];
        }
        while (btn.ocupence !== classes.Player.none && btn.element.disabled === true);

        btn.element.click(); // simulate a click on the button
        while (allFullBtn(megaBoard.boards[rand2].buttons)){ 
            // find a mini bard that is available if the one we chose is full
            rand2 = randomBoard();
        }

        lastBoard = rand2;
        //  clear if win
        if(megaBoard.winner !== classes.Player.none) {
            clearInterval(globals.inter);
        }
    }, speed);
}


function setClickListeners(){
    // reset button
    document.getElementById("reset")!.addEventListener("click", () => {
        let out = megaBoard.reset(globals);
        setClickListeners();
    });

    // simulate button
    document.getElementById("sim")!.addEventListener("click", () => {
        simulateGame(100);
    });

    // buttons on board
    megaBoard.boards.forEach((board) => {
        board.buttons.forEach((button) => {
            button.setOnclick(globals, afterTurn);
            button.setOnhover(megaBoard);
        });
    });


}

// main 

var globals: classes.Globals = {
    currentTurn: classes.Player.X,
    inter: 0
}
const megaBoard = new classes.MegaBoard(globals);
setClickListeners();

// TODO: add button on sorintg algorithm site to this one
// TODO: fix images not showing on real site
// TODO: add rules button / page