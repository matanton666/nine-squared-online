
const MINI_SIZE = 3;
const SEEN = 0.3;

// TODO: comment and clean

// ********* classes and interfaces *********

export interface Globals {
    currentTurn: Player;
    inter: number;
}


export enum Player {
    X = "X",
    O = "O",
    none = "-",
    tie = "tie"
}

export interface IButton {
    id: string;
    parentId: number;
    ocupence: Player;
    element: HTMLButtonElement;
}

export class MegaBoard {
    boards: MiniBoard[];
    winner: Player;

    constructor(globals: Globals) {
        this.boards = [];
        this.winner = Player.none;
        this.reset(globals);
    }

    public reset(globals: Globals): (number | Player)[] {

        if (this.boards.length !== 0) 
            this.eraseBoards(); // remove boards if they exist
        if (globals.inter) clearInterval(globals.inter); // remove interval if it exists
        globals.inter = 0;

        this.createBoard();
        this.addBorders(this.boards);

        this.winner = Player.none;
        globals.currentTurn = Player.X;

        document.getElementById("turn")!.innerText = "X";
        document.getElementById("turn")!.style.color = "red";
        return [globals.inter, globals.currentTurn];
    }

    public disableAllButtons = () => {
        // disable all mini boards buttons 
        this.boards.forEach(board => {
            board.setImageVisable();
            board.element.style.boxShadow = "0px 0px 0px 0px #494949";
            board.element.style.scale = "1";
            board.buttons.forEach(button => {
                button.element.disabled = true;
            });
        });
    }
    
    public showWinner(): void {
        const text = document.getElementById("turn")!;
        text.innerText =  this.winner !== Player.tie ?
        "player " + this.winner + " won!" : "its a Tie!";
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

    public HilightAllMiniWin = () =>{
        this.boards.forEach(board => {
            board.image.setOpacity(0.85);
        });
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
export class MiniBoard {
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
            this.image.element.src = "./../images/x.png";
        } else if (type === Player.O) {
            this.image.element.src = "./../images/o.png";
        } else if (type === Player.tie) {
            this.image.element.src = "./../images/tie2.png";
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


export class Button implements IButton {
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
    }

    public setOcupence(player: Player) {
            this.ocupence = player;
            this.element.innerText = this.ocupence;
            this.element.style.fontSize = "25px";
    }

    // set the player to be set in a button when clicked
    public setOnclick(globals: Globals, afterTurn: Function) {
        this.element.onclick = () => {
            if (this.ocupence === Player.none) {
                this.setOcupence(globals.currentTurn);
                // after turn checks
                afterTurn(this.element, this.id, this.parentId);
            }
        }
    }

    public setOnhover(megaBoard: MegaBoard) {
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

