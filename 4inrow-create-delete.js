(function () {    
    var myID; 
    var clickOnce = true;
    var COOL_DOWN = 1000; // ms 
    var LOCATION_ROOT_URL = Script.resolvePath(".");
    var boardID;

    this.preload = function (entityID) {
        myID = entityID;                      
    };

    // detect mouse clicks and triggers
    Entities.mouseReleaseOnEntity.connect(function (entityID, event) {        
        if (event.isLeftButton && clickOnce) {                      
            if (entityID === myID) {
                print("creating 4 in a row");
                var myProps = Entities.getEntityProperties(myID);
                if (myProps.text === "create 4 in a row game") {                            
                    boardID = Entities.addEntity({
                        type: "Shape",
                        shape: "Cube",
                        name: "4inrow-Board",
                        script: LOCATION_ROOT_URL + "4inrow-client.js?"+ Date.now(), 
                        serverScripts: LOCATION_ROOT_URL + "4inrow-server.js?"+ Date.now(),
                        color: {red: 0 ,green: 0,blue: 50},
                        alpha: 0.4,
                        parentID: myID,
                        localPosition: { x: 0, y: 3.5, z: -0.5 },
                        rotation: Quat.fromPitchYawRollRadians(0,Math.PI,0),       
                        dimensions: { x: 8, y: 7, z: 0.4 },
                        lifetime: -1,
                        userData: "{ \"grabbableKey\": { \"grabbable\": false} }"
                    });
                    Entities.editEntity(myID,{text: "delete 4 in a row game"});
                }
                if (myProps.text === "delete 4 in a row game" && boardID) {                            
                    Entities.deleteEntity(boardID);              
                    Entities.editEntity(myID,{text: "create 4 in a row game"});
                }
                clickOnce = false;
                Script.setTimeout(function () {
                    clickOnce = true;
                }, COOL_DOWN);
            }            
        }
    });   
});