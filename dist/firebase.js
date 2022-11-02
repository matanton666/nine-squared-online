(function () {
    let playerId;
    let playerRef;
    let secondPlayer;

    const gameBoard = document.getElementById('board');

    function onPlayerClick(placement) { 
    }

    function initGame() {
        const secondPlayer = firebase.database().ref('players');

        allPlayersRef.on('value', (snapshot) => {
            // occurs on whenever change in the database
            secondPlayer = snapshot.val() || {};

        });

        allPlayersRef.on('child_added', (snapshot) => {
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


    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            playerId = user.uid;
            playerRef = firebase.database().ref("players/" + playerId);
            
            playerRef.set({
                name: playerId.slice(-5).toUpperCase(),
                xOro: "x",
                winner: "false"
            });
            
            console.log(playerRef);
            playerRef.onDisconnect().remove();

            initGame();
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
)();