//
//  4inrow-server.js
//  
//  Created by Basinsky on 4-6 2023

//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

(function () { 
    var LOCATION_ROOT_URL = Script.resolvePath(".");
    var myID;
    var startButttonID1;
    var startButttonID2;
    var selectedTextID1;
    var selectedTextID2;
    var statusTextID;
    var selectDiscIDs = [];
    var discIDs = [];
    var gameState = [];
    var playerTurn = "";
    var isRunning = false;
    var isWinner = false;   
    var player1 = "";
    var player2 = "";
    var COLUMNS = 7;
    var ROWS = 6;
    var tempSet1IDs = []; 
    var tempSet2IDs = []; 
    var winSet =[];
    var interval;
    var winnersColor = 0;  

    // declare function that is remotelyCallable from the client script
    this.remotelyCallable = [
        "clicked"      
    ];

    this.preload = function (entityID) {
        myID = entityID;                      
    };

    // data is send to this function from client script, param is an array containing the data send
    this.clicked = function(id,param) {        
        var clickingPlayer = param[0];
        var clickedEntity = param[1];
        print(("Player: " + clickingPlayer + "clicked: " + clickedEntity));                
        switch (clickedEntity) { 

            // here we register the players 
            // register player 1
            case startButttonID1:
                // only register when the game is not running                
                if (!isRunning) {
                    switch (player1) {
                        // only register when player1 is empty                        
                        case "":
                            // dont allow the same player twice 
                            if (clickingPlayer !== player2) {                           
                                Entities.editEntity(selectedTextID1,{text: clickingPlayer});
                                player1 = clickingPlayer; 
                            }                                                   
                            break;
                            // if player is allready registered, unregister
                        case clickingPlayer:                        
                            Entities.editEntity(selectedTextID1,{text: ""});
                            player1 = "";
                            break;
                    }                                                                       
                }               
                break;            
            // resister player 2
            case startButttonID2:
                // only register when the game is not running                
                if (!isRunning) {                
                    switch (player2) {
                        // only register when player2 is empty                         
                        case "":
                            // dont allow the same player twice 
                            if (clickingPlayer !== player1) { 
                                Entities.editEntity(selectedTextID2,{text: clickingPlayer});
                                player2 = clickingPlayer;
                            }                       
                            break;
                            // if player is allready registered, unregister
                        case clickingPlayer:                        
                            Entities.editEntity(selectedTextID2,{text: ""});
                            player2 = "";
                            break; 
                    }
                                
                }
                break;
            
            // here we catch clicks on the ui discs and who is clicking
            case selectDiscIDs[0]:
                print("disc 0 is clicked");
                // only check the ui discs when the game is running
                if (isRunning) {
                    discClicked(0,selectDiscIDs[0],clickingPlayer);                 
                }
                break;
            case selectDiscIDs[1]:
                print("disc 1 is clicked");
                // only check the ui discs when the game is running
                if (isRunning) {
                    discClicked(1,selectDiscIDs[1],clickingPlayer);                    
                }
                break;
            case selectDiscIDs[2]:
                print("disc 2 is clicked");
                // only check the ui discs when the game is running
                if (isRunning) {
                    discClicked(2,selectDiscIDs[2],clickingPlayer);                    
                }
                break;
            case selectDiscIDs[3]:
                print("disc 3 is clicked");
                // only check the ui discs when the game is running
                if (isRunning) {
                    discClicked(3,selectDiscIDs[3],clickingPlayer);                   
                }
                break;
            case selectDiscIDs[4]:
                print("disc 4 is clicked");
                // only check the ui discs when the game is running
                if (isRunning) {
                    discClicked(4,selectDiscIDs[4],clickingPlayer);                    
                }
                break;
            case selectDiscIDs[5]:
                print("disc 5 is clicked");
                // only check the ui discs when the game is running
                if (isRunning) {
                    discClicked(5,selectDiscIDs[5],clickingPlayer);                    
                }
                break;
            case selectDiscIDs[6]:
                print("disc 6 is clicked");
                // only check the ui discs when the game is running
                if (isRunning) {
                    discClicked(6,selectDiscIDs[6],clickingPlayer);                     
                }
                break;           
        }        

        //  start the game if both players are registered, player1 is playing first
        if (player1 !== "" && player2 !== "" && !isRunning) {
            isRunning = true;
            playerTurn = player1;
            Entities.editEntity(statusTextID,{text: "Game on \n" + player1 + " starts"});            
            print("Let the game begin");
        }
    };

    // function to restart the game at its initial state
    function resetGame() { 
        isWinner = false;       
        Entities.editEntity(selectedTextID1,{text: ""});
        Entities.editEntity(selectedTextID2,{text: ""});        
        player1 = "";
        player2 = "";
        gameState = [];
        winnersColor = 0;
        playerTurn = "";
        // make all the discs white again
        for (var i in discIDs) {
            Entities.editEntity(discIDs[i],{
                color: {r: 255 ,g: 255,b: 255 },
                alpha: 1
            });
        // fill the gamestate array with 0
        }
        for (var row = 0; row < ROWS; row++) {
            for (var col = 0; col < COLUMNS; col++) {                
                gameState.push(0);                
            }
        }        
    }

    // function what to do when a ui disc is clicked
    function discClicked(number,discID,discClickerPlayer) {
        // only do something when one of the registered players clicks an ui disc
        if (discClickerPlayer === player1 || discClickerPlayer === player2) {

            // briefly change the color of the ui disc depending on player
            if (discClickerPlayer === player1 && playerTurn === player1) {
                Entities.editEntity(discID,{
                    color: {r: 255,g: 0,b: 0 },
                    alpha: 1
                });
                Script.setTimeout(function () {
                    Entities.editEntity(discID,{
                        color: {r: 255 ,g: 255,b: 255 },
                        alpha: 0.3
                    });
                }, 500);
            }
            if (discClickerPlayer === player2 && playerTurn === player2) {
                Entities.editEntity(discID,{
                    color: {r: 0 ,g: 255,b: 0 },
                    alpha: 1
                });
                Script.setTimeout(function () {
                    Entities.editEntity(discID,{
                        color: {r: 255 ,g: 255,b: 255 },
                        alpha: 0.3
                    });
                }, 500);
            }

            // determine where the disc ends when it falls from the top
            for (var row = 0; row < ROWS; row++) {
                // find the current disc, number is the column underneath the selected ui disc             
                var currentState = gameState[number + (row * COLUMNS)];
                // find the disc underneath the current disc             
                var nextState = gameState[number + ((row+1) * COLUMNS)];  
                // if we go beyond the bottom we go outside of the array change the state to -1 so we dont get an error              
                if (nextState === undefined) {
                    nextState = -1;
                }
                // only continue if the game state for the disc is 0 
                if (currentState === 0) {
                    // continue until we either hit an 1 a 2 or -1 (bottom)
                    if (nextState === -1 || nextState === 1 || nextState === 2) {                        
                        if (discClickerPlayer === player1 && playerTurn === player1) {
                            Entities.editEntity(discIDs[number + (row * COLUMNS)],{
                                color: {r: 255 ,g: 0,b: 0 }
                            });
                            gameState[number + (row * COLUMNS)] = 1;
                            playerTurn = player2;
                            Entities.editEntity(statusTextID,{text: player2 + " has to play"});
                        }
                        if (discClickerPlayer === player2 && playerTurn === player2) {
                            Entities.editEntity(discIDs[number + (row * COLUMNS)],{
                                color: {r: 0 ,g: 255,b: 0 }
                            });
                            gameState[number + (row * COLUMNS)] = 2;
                            playerTurn = player1;
                            Entities.editEntity(statusTextID,{text: player1 + " has to play"});
                        }                    
                    } 
                }
            }
        } 

        checkForWinner();

        if (isWinner) {
            isRunning = false;
            player1 = "";
            player2 = "";   
            isWinner = false;      
            showWinner();             
        }       
    }

    // Blink the winning 4 in a row
    function showWinner() {
        // make sure that the 4 discs blink in the color of the winning player 
        var wincolor = {r: 255 ,g: 255,b: 255 };
        if (winnersColor === 1) {
            wincolor = {r: 255 ,g: 0,b: 0 };
        } 
        if (winnersColor === 2) {
            wincolor = {r: 0 ,g: 255,b: 0 };
        } 

        interval = Script.setInterval(function () {
            // change color to winners color for disc 0            
            Entities.editEntity(winSet[0],{color: wincolor}); 
            // after 0.5 sec change color to white
            Script.setTimeout(function () {
                Entities.editEntity(winSet[0],{color: {r: 255 ,g: 255,b: 255 }});
            }, 500);
            // change color to winners color for disc 1 
            Entities.editEntity(winSet[1],{color: wincolor});
            // after 0.5 sec change color to white            
            Script.setTimeout(function () {
                Entities.editEntity(winSet[1],{color: {r: 255 ,g: 255,b: 255 }});
            }, 500);
            // change color to winners color for disc 2
            Entities.editEntity(winSet[2],{color: wincolor});
            // after 0.5 sec change color to white            
            Script.setTimeout(function () {
                Entities.editEntity(winSet[2],{color: {r: 255 ,g: 255,b: 255 }});
            }, 500);
            // change color to winners color for disc 3
            Entities.editEntity(winSet[3],{color: wincolor}); 
            // after 0.5 sec change color to white           
            Script.setTimeout(function () {
                Entities.editEntity(winSet[3],{color: {r: 255 ,g: 255,b: 255 }});
            }, 500);            
        }, 1000);

        // after 10 seconds clear the innterval and reset the game
        Script.setTimeout(function () {
            Script.clearInterval(interval);
            resetGame();
        }, 10000);       
    }

    // function to check the winner
    function checkForWinner() {                
        var player1Count = 0;
        var player2Count = 0;
        var player1CountMirror = 0;
        var player2CountMirror = 0;
        tempSet1IDs = [];
        tempSet2IDs = [];                

        // find 4 horizontal        
        for (var col = 0; col < COLUMNS-1; col++) {
            for (var row = 0; row < ROWS-2; row++) {
                for (var counter = 0; counter < 4; counter++) {                                   
                    var state = gameState[parseInt((col*COLUMNS)+row+counter)];                    
                    if (state === 1) {                       
                        player1Count++;
                        tempSet1IDs.push(discIDs[parseInt((col*COLUMNS)+row+counter)]);                                                
                    }
                    if (state === 2) {                      
                        player2Count++; 
                        tempSet2IDs.push(discIDs[parseInt((col*COLUMNS)+row+counter)]);                                         
                    }                
                    if (player1Count > 3) {
                        print(player1 + " has  4 in a row");
                        Entities.editEntity(statusTextID,{text: player1 + " wins!"});
                        winSet = tempSet1IDs;
                        isWinner = true;
                        winnersColor = 1;
                        player1Count = 0;                        
                    }
                    if (player2Count > 3) {
                        print(player2 + " has  4 in a row");
                        Entities.editEntity(statusTextID,{text: player2 + " wins!"});
                        winSet = tempSet2IDs;
                        winnersColor = 2;
                        player2Count = 0;
                        isWinner = true;                        
                    }
                }                
                player1Count = 0;
                player2Count = 0;
            }
        }
        
        // find 4 vertical
        for (col = 0; col < 7; col++) {
            for (row = 0; row < 3; row++) {
                for (counter = 0; counter < 4; counter++) {                                   
                    state = gameState[parseInt((row*7)+col+(counter*7))];                    
                    if (state === 1) {                       
                        player1Count++;
                        tempSet1IDs.push(discIDs[parseInt((row*7)+col+(counter*7))]);                        
                    }
                    if (state === 2) {                      
                        player2Count++; 
                        tempSet2IDs.push(discIDs[parseInt((row*7)+col+(counter*7))]);                                            
                    }                
                    if (player1Count > 3) {
                        print(player1 + " has  4 in a row");
                        Entities.editEntity(statusTextID,{text: player1 + " wins!"});
                        winSet = tempSet1IDs;
                        isWinner = true;
                        winnersColor = 1;
                        player1Count = 0;                        
                    }
                    if (player2Count > 3) {
                        print(player2 + " has  4 in a row");
                        Entities.editEntity(statusTextID,{text: player2 + " wins!"});
                        player2Count = 0;
                        isWinner = true; 
                        winSet = tempSet2IDs;
                        winnersColor = 2;                       
                    }
                }                
                player1Count = 0;
                player2Count = 0;
            }        
        }
        // find 4 diagonal        
        for (col = -2; col < 4; col++) {
            for (row = 0; row < 3; row++) {
                for (counter = 0; counter < 4; counter++) {
                    var loc = parseInt((row*8)+col+(counter*8));                    
                    if (loc > -1 && loc < 42) {
                        if (col === -2 && row < 2) {
                            // do nothing
                        } else {
                            if (col === 3 && row > 0) {
                                // do nothing
                            } else {           
                                print("row:" +row + "col: " + col + "loc: " + loc);
                                state = gameState[loc];                                 
                                if (state === 1) {                       
                                    player1Count++;
                                    tempSet1IDs.push(discIDs[loc]);
                                    // print("playercount1" + player1Count);
                                }
                                if (state === 2) {                      
                                    player2Count++;
                                    tempSet2IDs.push(discIDs[loc]); 
                                    // print("playercount2" + player2Count);                    
                                }                
                                if (player1Count > 3) {
                                    print(player1 + " has  4 in a row");
                                    Entities.editEntity(statusTextID,{text: player1 + " wins!"});
                                    winSet = tempSet1IDs;
                                    winnersColor = 1;
                                    isWinner = true;
                                    player1Count = 0;                                    
                                }
                                if (player2Count > 3) {
                                    print(player2 + " has  4 in a row");
                                    Entities.editEntity(statusTextID,{text: player2 + " wins!"});
                                    winSet = tempSet2IDs;
                                    player2Count = 0;
                                    isWinner = true; 
                                    winnersColor = 1;                                   
                                }
                                // mirror
                                var range = Math.floor(loc/7);
                                var remainder = loc % 7;
                                var mirror = (6 - remainder) + range * 7;
                                var mirrorState = gameState[mirror];

                                if (mirrorState === 1) {                       
                                    player1CountMirror++;
                                    tempSet1IDs.push(discIDs[mirror]);
                                    // print("playercount1" + player1Count);
                                }
                                if (mirrorState === 2) {                      
                                    player2CountMirror++;
                                    tempSet2IDs.push(discIDs[mirror]); 
                                    // print("playercount2" + player2Count);                    
                                }                
                                if (player1CountMirror > 3) {
                                    print(player1 + " has  4 in a row");
                                    Entities.editEntity(statusTextID,{text: player1 + " wins!"});
                                    winSet = tempSet1IDs;
                                    isWinner = true;
                                    winnersColor = 1;
                                    player1CountMirror = 0;                                    
                                }
                                if (player2CountMirror > 3) {
                                    print(player2 + " has  4 in a row");
                                    Entities.editEntity(statusTextID,{text: player2 + " wins!"});
                                    winSet = tempSet2IDs;
                                    player2CountMirror = 0;
                                    winnersColor = 2;
                                    isWinner = true;                                                                 
                                }
                            }
                        }
                    }
                }
                player1Count = 0;
                player2Count = 0;
                player1CountMirror = 0;
                player2CountMirror = 0;
                tempSet1IDs = [];
                tempSet2IDs = [];

            }        
        }
        return "";
    }
    
    // spawn the discs
    function setupDiscs() {
        // playing field matrix 7 X 6        
        for (var row = 0; row < ROWS; row++) {
            for (var col = 0; col < COLUMNS; col++) {
                print (col + " " + row);
                var discID = Entities.addEntity({
                    type: "Shape",
                    shape: "Cylinder",
                    parentID: myID,
                    name: "Disc" + col + row,        
                    color: {r: 255, g: 255,b: 255},                    
                    localPosition: { x: -COLUMNS/2+col+0.4, y: ROWS/2-row, z: 0.45 }, 
                    localRotation: Quat.fromPitchYawRollRadians(-Math.PI/2,0,0),      
                    dimensions: { x: 0.8, y: 0.1, z: 0.8 },
                    lifetime: -1,
                    userData: "{ \"grabbableKey\": { \"grabbable\": false} }"
                });
                // default the state to 0
                gameState.push(0);
                // add the uuid to the discIDs array so we can edit them later
                discIDs.push(discID);
            }
        }
        // ui discs        
        for (var col2 = 0; col2 < COLUMNS; col2++) {            
            var selectDiscID = Entities.addEntity({
                type: "Shape",
                shape: "Cylinder",
                parentID: myID,
                name: "selectDisc" + col2,        
                color: {red: 255 ,green: 255,blue: 255},
                alpha: 0.3,                    
                localPosition: { x: -COLUMNS/2+col2+0.4, y: 4, z: 0.45 }, 
                localRotation: Quat.fromPitchYawRollRadians(-Math.PI/2,0,0),      
                dimensions: { x: 0.8, y: 0.1, z: 0.8 },
                lifetime: -1,
                userData: "{ \"grabbableKey\": { \"grabbable\": false} }"
            });
            // add the uuid to the selectdiscIDs array so we can checkif they are clicked
            selectDiscIDs.push(selectDiscID);            
        }        
    }

    // create ui and parent to the board. 2 image start buttons, 2 text entity for the players an a text entity for the status
    function setupUI() {
        print("ui");
        startButttonID1 = Entities.addEntity({
            type: "Image",        
            name: "4inrowStart1",
            parentID: myID,
            imageURL: LOCATION_ROOT_URL +"start.png",    
            description: "",        
            localPosition: { x: 3.5, y: -3, z: 0.42 },
            localRotation: Quat.fromPitchYawRollRadians(0,0,0),        
            dimensions: { x: 0.8, y: 0.8, z: 0.8 },
            lifetime: -1,
            userData: "{ \"grabbableKey\": { \"grabbable\": false, \"triggerable\": true}}"
        });

        startButttonID2 = Entities.addEntity({
            type: "Image",        
            name: "4inrowStart2",
            parentID: myID,
            imageURL: LOCATION_ROOT_URL +"start.png",    
            description: "",        
            localPosition: { x: -3.5, y: -3, z: 0.42 },
            localRotation: Quat.fromPitchYawRollRadians(0,0,0),        
            dimensions: { x: 0.8, y: 0.8, z: 0.8 },
            lifetime: -1,
            userData: "{ \"grabbableKey\": { \"grabbable\": false, \"triggerable\": true}}"
        });

        selectedTextID1 = Entities.addEntity({
            type: "Text",        
            name: "4inrowSelected1",
            text: "",
            lineHeight: 0.3,
            alignment: "center",
            parentID: myID,        
            localPosition: { x: 2, y: -3, z: 0.42 },
            localRotation: Quat.fromPitchYawRollRadians(0,0,0),        
            dimensions: { x: 1.8, y: 0.5, z: 0.8 },
            lifetime: -1,
            backgroundColor: {r: 12,g: 50,b: 133},
            textColor: {r: 255,g: 255,b: 255} 
        });
    
        selectedTextID2 = Entities.addEntity({
            type: "Text",        
            name: "4inrowSelected2",
            text: "",
            lineHeight: 0.3,
            alignment: "center",
            parentID: myID,        
            localPosition: { x: -2, y: -3, z: 0.42 },
            localRotation: Quat.fromPitchYawRollRadians(0,0,0),        
            dimensions: { x: 1.8, y: 0.5, z: 0.8 },
            lifetime: -1,
            backgroundColor: {r: 12,g: 50,b: 133},
            textColor: {r: 255,g: 255,b: 255} 
        });

        statusTextID = Entities.addEntity({
            type: "Text",        
            name: "4inrowStatus",
            text: "Press start to begin",
            lineHeight: 0.2,
            alignment: "center",
            parentID: myID,        
            localPosition: { x: 0, y: -3, z: 0.42 },
            localRotation: Quat.fromPitchYawRollRadians(0,0,0),        
            dimensions: { x: 1.8, y: 0.5, z: 0.8 },
            lifetime: -1,
            backgroundColor: {r: 12,g: 50,b: 133},
            textColor: {r: 255,g: 255,b: 255} 
        });
    }

    // Script starts here, allow 2 seconds for the entityID to be created so it can be used later to parent to.
    Script.setTimeout(function () {
        setupDiscs();
        setupUI();    
    }, 2000); 
    
});