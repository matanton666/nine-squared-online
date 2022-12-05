import * as classes from "./classes.js";
import * as index from "./index.js";

const firebaseConfig = {
    apiKey: "AIzaSyClbUYRPEC3dpjoCYM2Ek9rFXEy0kxxd2c",
    authDomain: "nine-squared.firebaseapp.com",
    databaseURL: "https://nine-squared-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "nine-squared",
    storageBucket: "nine-squared.appspot.com",
    messagingSenderId: "209271367711",
    appId: "1:209271367711:web:ca9aca6b33eba08cae4d2a"
}; 


const removeWaitScreen = () => {
    document.getElementById("gameID").style.visibility = "hidden";
    document.getElementById("onlineText").style.visibility = "hidden";
    document.getElementById("copy").style.visibility = "hidden";
    document.getElementById("startOnlineGame").style.visibility = "hidden";
}

const loadingScreen = () => {
    document.getElementById("onlineText").innerHTML = "Loading...";
    document.getElementById("onlineText").style.visibility = "visible";
}

const addBoardToDatabase = (board) => {
    const database = firebase.database();
    const boardRef = database.ref(`games/${gameId}/board`);
    boardRef.set(board.toJsonRepresentation());
}

const setBoardChangeListener = (database) => {
    database.ref(`games/${gameId}/board`).on('value', (snapshot) => {
        // occurs on whenever change in the database
        let board = snapshot.val() || {};
        try{
            index.megaBoard.fromJsonRepresentation(board);
        }
        catch{
            console.log("error");
            window.alert("other player left");
            window.location.href = "./index.html";
        }
    });
    
    database.ref(`games/${gameId}/currentTurn`).on('value', (snapshot) => {
        // occurs on whenever change in the database
        let val = snapshot.val() || {};
        if (val == currPlayer.xOro) {
            firebase.database().ref(`games/${gameId}/lastMove`).once('value').then((snapshot) => {
                let vals = snapshot.val() || {};
                index.disableMiniBoardsByButton(vals[0]);
                const miniWin = index.checkBoardWin(index.megaBoard.boards[vals[1]].buttons);
                index.megaBoard.boards[vals[1]].winner = miniWin === classes.Player.none ? classes.Player.none : miniWin;
                index.megaBoard.boards[vals[1]].setImage(miniWin);
            })
        }
        else {
            index.megaBoard.disableAllButtons();
        }
    });
    index.setClickListeners();
    setListenersForButtons();
}

const setListenersForButtons = () => {
    index.megaBoard.boards.forEach((board) => {
        board.buttons.forEach((button) => {
            button.element.onclick = () => {
                if (button.ocupence === classes.Player.none) {
                    button.setOcupence(currPlayer.xOro);
                    firebase.database().ref(`games/${gameId}/lastMove`).set([button.id, button.parentId]);
                    addBoardToDatabase(index.megaBoard);
                    index.afterTurn(button.element, button.id, button.parentId);
                    if (index.megaBoard.winner === classes.Player.none) {
                        firebase.database().ref(`games/${gameId}/currentTurn`).set(currPlayer.xOro === classes.Player.X ? classes.Player.O : classes.Player.X);
                    }
                }
            }
        });
    });
}

function startFirebase() {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            playerId = user.uid;

            const database = firebase.database();
            gameRef = database.ref(`games/${gameId}`);
            playerRef = database.ref(`games/${gameId}/players/${playerId}`);
        
            let xOro = createOrJoin === "create" ? classes.Player.X : classes.Player.O;
            playerRef.set({
                id: playerId,
                xOro: xOro,
                winner: "false",
            });
            
            playerRef.onDisconnect().remove();

            if (createOrJoin === "create")
                initGameCreate();
            else
                initGameJoin();
        }
        else{
            console.log("logged out");
        }
    });

    firebase.auth().signInAnonymously().catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log(errorCode, errorMessage);
    });
}


function initGameCreate() {
    const database = firebase.database();
    const allPlayerRef = database.ref(`games/${gameId}/players/`);
    database.ref(`games/${gameId}/currentTurn`).set(classes.Player.none);
    database.ref(`games/${gameId}/currentTurn`).onDisconnect().remove();
    firebase.database().ref(`games/${gameId}/lastMove`).set(["button-" + 4, 4]);
    firebase.database().ref(`games/${gameId}/lastMove`).onDisconnect().remove();

    allPlayerRef.on('child_added', (snapshot) => {
        // occures on new node on tree
        const addedPlayer = snapshot.val() || {};
        if (addedPlayer.id !== playerId && currPlayer !== undefined) {
            if (addedPlayer.gameId === currPlayer.gameId) {
                // if the player is not the current player, then add it to the second player
                secondPlayer = addedPlayer;
                console.log("other player", secondPlayer);
                document.getElementById("startOnlineGame").style.visibility = "visible";
                document.getElementById("startOnlineGame").addEventListener("click", startOnlineGame);
            }
        }
        else if (addedPlayer.id === playerId) {
            // this player joined
            currPlayer = addedPlayer;
            console.log("current player", currPlayer);
        }
        // put here all code to initiate a player
    });
}



function initGameJoin() {
    const database = firebase.database();
    const allPlayerRef = database.ref(`games/${gameId}/players/`);

    database.ref(`games/${gameId}/currentTurn`).on('value', (snapshot) => {
        // occurs on whenever change in the database
        let val = snapshot.val() || {};
        if (val == classes.Player.X) {
            console.log("game started");
            removeWaitScreen();
            index.megaBoard.reset(index.globals);
            index.megaBoard.disableAllButtons();
            setBoardChangeListener(database);
        }
    });

    allPlayerRef.on('child_added', (snapshot) => {
        // occures on new node on tree
        const addedPlayer = snapshot.val() || {};
        if (addedPlayer.id !== playerId && currPlayer !== undefined) {
            if (addedPlayer.gameId === currPlayer.gameId) {
                // if the player is not the current player, then add it to the second player
                secondPlayer = addedPlayer;
                console.log("other player", secondPlayer);
                // change text to "waiting for other player to start game"
                document.getElementById("onlineText").innerHTML = "Waiting for other player to start game";
                removeWaitScreen();
                document.getElementById("onlineText").style.visibility = "visible";

            }
        }
        else if (addedPlayer.id === playerId) {
            // this player joined
            currPlayer = addedPlayer;
            console.log("current player", currPlayer);
        }
        // put here all code to initiate a player
    });
}


function startOnlineGame() {
    index.megaBoard.reset(index.globals);
    removeWaitScreen();
    addBoardToDatabase(index.megaBoard);
    setBoardChangeListener(firebase.database());
    firebase.database().ref(`games/${gameId}/board`).onDisconnect().remove();
    firebase.database().ref(`games/${gameId}/currentTurn`).set(classes.Player.X);
}

async function checkGameIdInDataBase(id) {
    let success = false;
    try{
        firebase.initializeApp(firebaseConfig);
        const gamesRef = firebase.database().ref("games");
        await gamesRef.once("value", (snapshot) => {
            let games = snapshot.val() || {};
            Object.keys(games).forEach((key) => {
                console.log("players: ", );
                if (key == id && Object.keys(games[key].players).length == 1) {
                    success = true;
                    console.log("object found");
                    return;
                }
            });
        });
    }
    catch(e) {
        console.log("no games with this id" + e);
        success = false;
    }
    return success;
}


let createOrJoin, gameId, gameRef;
let playerId, playerRef, secondPlayerRef;
let secondPlayer, currPlayer;


document.addEventListener("DOMContentLoaded", async function(){
    const urlParams = new URLSearchParams(window.location.search);
    gameId = urlParams.get("gameId");

    if (gameId === "0") {
        // offline game and do not execute firebase
        return;
    }
    if (urlParams.get("player") === "x") {
        // start firebase and wait for other player
        firebase.initializeApp(firebaseConfig);
        createOrJoin = "create"
        startFirebase();
    }
    else if (await checkGameIdInDataBase(gameId)) {
        if (urlParams.get("player") === "o") {
            loadingScreen();
            // start firebase and wait for other player
            createOrJoin = "join"
            startFirebase();
        }
        else {
            // game id not found in database
            window.alert("Game id not found");
            window.location.href = "./index.html";
        }
    }
    else {
        // game id not found in database
        window.alert("Game id not found");
        window.location.href = "./index.html";
    }
});
// TODO: configure firebase rules