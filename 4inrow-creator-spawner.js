// script to spawn the game

// use this so the client and server script are linked from the same directory
var LOCATION_ROOT_URL = Script.resolvePath(".");      
var textID = Entities.addEntity({
    type: "Text",
    text: "create 4 in a row game",
    alignment: "center",
    name: "4inrow-Board",
    script: LOCATION_ROOT_URL + "4inrow-create-delete.js?"+ Date.now(), 
    textColor: {r: 255 ,g: 255,b: 255},
    backgroundColor: {r: 12,g: 50,b: 133},
    lineHeight: 0.2,
    alpha: 1,
    position: Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, { x: 0, y: 0.5, z: -3 })),
    rotation: Quat.fromPitchYawRollRadians(0,Math.PI,0),       
    dimensions: { x: 2, y: 0.2, z: 0.01 },
    lifetime: -1,
    userData: "{ \"grabbableKey\": { \"grabbable\": false} }"
});
// self destruct the script after the entity is spawned
Script.stop();
