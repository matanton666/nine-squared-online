const firebaseConfig = {
    apiKey: "AIzaSyClbUYRPEC3dpjoCYM2Ek9rFXEy0kxxd2c",
    authDomain: "nine-squared.firebaseapp.com",
    databaseURL: "https://nine-squared-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "nine-squared",
    storageBucket: "nine-squared.appspot.com",
    messagingSenderId: "209271367711",
    appId: "1:209271367711:web:ca9aca6b33eba08cae4d2a"
}; 

function startFirebase(playerId, playerRef) {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            playerId = user.uid;
            playerRef = firebase.database().ref("players/" + playerId);
            
            playerRef.set({
                name: playerId.slice(-5).toUpperCase(),
                xOro: "x",
                winner: "false",
                gameId: new URLSearchParams(window.location.search).get("gameId")
            });
            
            console.log(playerRef);
            playerRef.onDisconnect().remove();

            initGame(playerId, playerRef);
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
function initGame(playerId, playerRef) {
    const allPlayerRef = firebase.database().ref('players');
    let secondPlayer, currPlayer;

    allPlayerRef.on('value', (snapshot) => {
        // occurs on whenever change in the database
        players = snapshot.val() || {};
        Object.keys(players).forEach((key) => {
            if (key != playerId) {
                // if the player is not the current player, then add it to the second player
                secondPlayer = players[key];
            }
            else {
                currPlayer = players[key];
            }
        });
        console.log("other player", secondPlayer);
        console.log("current player", currPlayer);
        //     //TODO: call function to start game
        // Now update the DOM
    });

    allPlayerRef.on('child_added', (snapshot) => {
        // occures on new node on tree
        const addedPlayer = snapshot.val();
        if (addedPlayer.id !== playerId) {
            // other player joined
        }
        else if (addedPlayer.id === playerId) {
            // this player joined
        }
        // put here all code to initiate a player
    });
}

document.addEventListener("DOMContentLoaded", function(){
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("gameId") === "0") {
        // offline game and do not execute firebase
        return;
    }
    else 
    {
        let playerId, playerRef;
        // start firebase and wait for other player
        firebase.initializeApp(firebaseConfig);
        startFirebase(playerId, playerRef);
    }

});