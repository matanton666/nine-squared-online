
const MINI_SIZE = 3;
const SEEN = 0.3; // opacity

// ********* classes and interfaces *********

export interface Globals {
    currentTurn: Player;
    inter: number;
    gameId: number;
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


/**
 * class of the mega board of the game containing all the mini boards and board creation logic
 */
export class MegaBoard {
    boards: MiniBoard[];
    winner: Player;

    /**
     * cerates the megaBoard
     * @param globals global variables object
     */
    constructor(globals: Globals) {
        this.boards = [];
        this.winner = Player.none;
        this.reset(globals);
    }

    /**
     * resets the game, erases all the buttons and creates new ones
     * if there is simulation, it will also reset it
     * @param globals global variables object
     */
    public reset(globals: Globals){

        if (this.boards.length !== 0) 
            this.eraseBoards(); // remove boards if they exist
        if (globals.inter) clearInterval(globals.inter); // remove interval if it exists
        globals.inter = 0;

        // start new game
        this.createBoard();
        this.addBorders(this.boards);

        this.winner = Player.none;
        globals.currentTurn = Player.X;

        document.getElementById("turn")!.innerText = "X";
        document.getElementById("turn")!.style.color = "red";
    }

    /**
     * disables all the buttons in the board
     */
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
    
    /**
     * show the winner of the game
     */
    public showWinner(): void {
        const text = document.getElementById("turn")!;
        text.innerText =  this.winner !== Player.tie ? // check what player to show
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

    /**
     * checks if the game is over highlight all the background images of the winning mini boards
     */
    public HilightAllMiniWin = () =>{
        this.boards.forEach(board => {
            board.image.setOpacity(0.85);
        });
    }

    /**
     * removes all the mini boards from the mega board
     */
    public eraseBoards(): void {
        this.boards.forEach(board => {
            board.buttons.forEach(button => {
                button.element.remove();
            });
            board.element.remove();
        });
        this.boards = [];
    }

    // : string{
    //     let json = "[";
    //     for (let i = 0; i < this.boards.length; i++) {
    //         json += this.boards[i].toJsonRepresentation();
    //         if (i !== this.boards.length - 1) json += ",";
    //     }
    //     json += "]";
    //     return json;
    // }

    // to array representation for the small squares in the mini boards (make an array of objects with {winner, buttons})
    public toJsonRepresentation(): string {
        let json = "[";
        for (let i = 0; i < this.boards.length; i++) {
            json += this.boards[i].toJsonRepresentation();
            if (i !== this.boards.length - 1) json += ",";
        }
        json += "]";
        return json;
    }

    // converts from the json representation to the board
    public fromJsonRepresentation(json: string): void {
        const arr = JSON.parse(json);
        for (let i = 0; i < MINI_SIZE; i++) {
            for (let j = 0; j < MINI_SIZE; j++) {
                this.boards[i*MINI_SIZE + j].winner = arr[i].w;
                this.boards[i*MINI_SIZE + j].fromJsonRepresentation(JSON.stringify(arr[i].btns));
            }
        }
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
        // indexes of the mini boards and buttons that need a border and where
        const rightBorder = [0, 1, 3, 4, 6, 7];
        const bottomBorder = [0, 1, 2, 3, 4, 5];
        const leftBorder = [1, 2, 4, 5, 7, 8];
        const topBorder = [3, 4, 5, 6, 7, 8];
        const settings = "4px solid black";
        const miniSettings = "1px solid black";

        // loop all lists and set borders for every mini board
        for(let i = 0; i < boards.length; i++){
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

/**
 * class of the image that is shown when a mini board is won
 */
class TicImage {
    id: number;
    element: HTMLImageElement;
    type: Player;
    opacity: number = 0;
    position: number = -1; // 1 for front -1 for back

    /**
     * sets the image
     * @param id id of the image
     * @param element the image html element
     * @param type player type of the image (x or o or tie)
     * @param opacity initial opacity of the image
     */
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


/**
 * class of the mini board that is inside the mega board containing 9 buttons
 */
export class MiniBoard {
    id: string;
    buttons: Button[];
    element: HTMLTableElement;
    winner: Player;
    image: TicImage;
    
    /**
     * constructs the mini board and sets style
     * @param id id of the mini board
     * @param element html element of the board table
     */
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
    
    /**
     * creates all of the buttons inside of the mini board
     */
    public createButtons() {
        let count = 0; // 1-9 buttons in mini board
        for(let l = 0; l < MINI_SIZE; l++){
            // every mini board row
            const miniRow = document.createElement("tr");
            
            for(let m = 0; m < MINI_SIZE; m++){
                // create every button in mini board 
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
    
    /**
     * create the images on top of the mini board for x and o and tie
     * @param path path to the image
     * @param typ type of the image (x or o or tie)
     * @returns a new image object
     */
    private createImage(path: string, typ: Player): TicImage {
        const img = document.createElement("img");
        img.src = path;
        // position the image in the middle of the mini board
        this.element.appendChild(img);
        
        return new TicImage(parseInt(this.id), img, typ, 0);
    }
    
    // set image new path
    public setImage(type: Player) {
        if (this.image.type === Player.none){ // check if image is not already set
            if (type === Player.X) {
                this.image.element.src = "./images/x.png";
            } else if (type === Player.O) {
                this.image.element.src = "./images/o.png";
            } else if (type === Player.tie) {
                this.image.element.src = "./images/tie2.png";
            }
            this.image.type = type;
        }
    }
    
    // set image opacity to visible and position to fronts
    public setImageVisable() {
        if (this.image.type !== Player.none) {
            this.image.setOpacity(SEEN);
            this.image.setPosition(1);
        }
    }
    
    // set image opacity to invisible and position to black
    public setImageInvisable() {
        if (this.image.type !== Player.none) {
            this.image.setPosition(-1);
        }
    }
    public toJsonRepresentation() {
        let json = "{";
        json += `"w": "${this.winner}",`;
        json += `"btns": [`;
        for (let i = 0; i < this.buttons.length; i++) {
            json += this.buttons[i].toJsonRepresentation();
            if (i !== this.buttons.length - 1) json += ",";
        }
        json += `]}`;
        return json;
    }

    public fromJsonRepresentation(json: string) {
        const obj = JSON.parse(json);
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].fromJsonRepresentation(JSON.stringify(obj[i]));
        }
    }
}


/**
 * class of the button that is inside the mini board
 */
export class Button implements IButton {
    id: string;
    parentId: number;
    ocupence: Player;
    element: HTMLButtonElement;

    /**
     * creates a button and sets settings
     * @param id id of the button
     * @param element html element of the button
     * @param parent parent id of the button (miniBoard id)
     */
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

    // set a player to be set in the button when clicked
    public setOnclick(globals: Globals, afterTurn: Function) {
        this.element.onclick = () => {
            if (this.ocupence === Player.none) {
                this.setOcupence(globals.currentTurn);
                // after turn checks
                afterTurn(this.element, this.id, this.parentId);
            }
        }
    }

    /**
     * sets event listener for the button when it is clicked to highlight the mini board corresponding to it
     * @param megaBoard the mega board that the button is in
     */
    public setOnhover(megaBoard: MegaBoard) {
        this.element.onmouseover = () =>{
            if (this.ocupence === Player.none) {
                // highlight the mini board that corresponds to the button hovered
                const id = this.id.split("-")[1];
                let parent = megaBoard.boards[parseInt(id)];

                parent.element.style.boxShadow = "0px 0px 5px 5px #494949";
                parent.element.style.scale = "0.95";
            }
        }
        this.element.onmouseout = () =>{
            // revert to normal on mouse out
            if (this.ocupence === Player.none) {
                const id = this.id.split("-")[1];
                let parent = megaBoard.boards[parseInt(id)];

                parent.element.style.boxShadow = "0px 0px 0px 0px #494949";
                parent.element.style.scale = "1";
            }
        }
    }

    public toJsonRepresentation() {
        return `{ "id": "${this.id.split("-")[1]}", "ocu": "${this.ocupence}" }`;
    }
    public fromJsonRepresentation(json: string) {
        const obj = JSON.parse(json);
        this.id = "button-" + obj.id;
        this.ocupence = obj.ocu;
    }
}

//TODO: fix tojsonrepresentation 