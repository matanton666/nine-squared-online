import * as classes from "./classes.js";

// ***************************** functions for game logic *****************************
const MEGA_SIZE = 9; // button amount in mega board

/**
 * gives a random number between 0 and 9 for a random mini board to be selected
 * @returns id of free mini board
 */
const randomBoard = (): number => {
    let rand = 0;
    do{
        rand = Math.floor(Math.random() * MEGA_SIZE);
    } // find a random board that is not full
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

    playingBoard.setImageInvisable(); // if there is a image winner
    playingBoard.buttons.forEach(button => { // enable buttons in playing board
        if (button.ocupence === classes.Player.none) {
            button.element.disabled = false;
        }
    });

}

// ********* functions for checking winner in boards *********


// functions to determine if a player won in a row colomn or diagonal in the big board(mini) and in a mini board (button)
const allEqualMini = (arr: classes.MiniBoard[]) => arr.every(v => v.winner === arr[0].winner &&v.winner !== classes.Player.none &&v.winner !== classes.Player.tie); 
const allEqualButton = (arr: classes.Button[]) => arr.every(v => typeof v !== "undefined" && v.ocupence === arr[0].ocupence && v.ocupence !== classes.Player.none); 

// checks if a certain board is full (Btn -> a mini board) (MiniBoard -> the mega board)
const allFullBtn = (arr: classes.Button[]) => arr.every(v => v.ocupence !== classes.Player.none);
const allFullMini = (arr: classes.MiniBoard[]) => arr.every(v => v.winner !== classes.Player.none);

// checks if a player won in the mega board
const checkMiniBoards = (all: classes.MiniBoard[][]): classes.Player => {
    for (const list of all) {
        if (allEqualMini(list)){
            return list[0].winner;
        }
    }
    return classes.Player.none;
}

// checks if a player won in a mini board
const checkButtons = (all: classes.Button[][]): classes.Player => {
    for (const list of all) {
        if (allEqualButton(list)){
            return list[0].ocupence;
        }
    }
    return classes.Player.none;
}

/**
 * function takes a boards elements and checks if there is a winner in it (mini board or mega board)
 * @param board the board to check for a winner in (mini board or mega board)
 * @returns a winner of type Player (none if no winner)
 */
function checkBoardWin(board: classes.MiniBoard[] | classes.Button[]): classes.Player {
    let col1 = [], col2 = [], col3 = [], diag1 = [], diag2 = [], row1 = [], row2 = [], row3 = [];
    let winner = classes.Player.none;
    // get all rows and columns and diagonals to checks
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


/**
 * function is called when a button is clicked and does the checks needed
 * (check for winners and if the board is full and does player switching)
 * @param element the html element of the button clicked
 * @param id the id of the button clicked
 * @param parentId the id of the parent board of the button clicked (the mini board)
 * @returns none
 */
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
    
    // change turn and show it
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
            // find a mini bard that is available if the one chosen is full
            rand2 = randomBoard();
        }

        lastBoard = rand2;
        //  finish if win
        if(megaBoard.winner !== classes.Player.none) {
            clearInterval(globals.inter);
        }
    }, speed);
}


/**
 * function sets all necessary event listeners for the buttons in the website
 */
function setClickListeners(noSim: boolean=false){
    // reset button
    document.getElementById("reset")!.addEventListener("click", () => {
        let out = megaBoard.reset(globals);
        setClickListeners();
    });

    if (!noSim){
        // simulate button
        document.getElementById("sim")!.addEventListener("click", () => {
            simulateGame(100);
        });
    }  
    else
    {
        // stop simulation button
        document.getElementById("sim")!.style.visibility = "hidden";
    }

    // buttons on board
    megaBoard.boards.forEach((board) => {
        board.buttons.forEach((button) => {
            button.setOnclick(globals, afterTurn);
            button.setOnhover(megaBoard);
        });
    });
}


function startGame(globals: classes.Globals){
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId');
    if (gameId === "0"){ // offline game
        setClickListeners();
    }
    else 
    {
        // online game
        const player = urlParams.get('player');
        console.log(gameId, player);
        if (gameId === null || player === null){ 
            alert(`game with that code does not exist`); // set game to offline
            window.location.href = "/index.html";
            return;
        }
        // set game for 2 players
        globals.gameId = parseInt(gameId);
        setClickListeners(true);
        megaBoard.disableAllButtons();
    }
}

// main 
var globals: classes.Globals = {
    currentTurn: classes.Player.X,
    inter: 0,
    gameId: 0
}
const megaBoard = new classes.MegaBoard(globals);
startGame(globals);