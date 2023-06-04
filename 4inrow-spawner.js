//
//  4inrow-spawner.js
//  
//  Created by Basinsky on 4-6 2023

//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

// script to spawn the game

// use this so the client and server script are linked from the same directory
var LOCATION_ROOT_URL = Script.resolvePath(".");      
var boardID = Entities.addEntity({
    type: "Shape",
    shape: "Cube",
    name: "4inrow-Board",
    script: LOCATION_ROOT_URL + "4inrow-client.js?"+ Date.now(), // add Date.now after the ? to create an unique name
    serverScripts: LOCATION_ROOT_URL + "4inrow-server.js?"+ Date.now(), // add Date.now after the ? to create an unique name  
    color: {red: 0 ,green: 0,blue: 50},
    alpha: 0.4,
    position: Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, { x: -4, y: 3.5, z: -3 })),
    rotation: Quat.fromPitchYawRollRadians(0,Math.PI,0),       
    dimensions: { x: 8, y: 7, z: 0.4 },
    lifetime: -1,
    userData: "{ \"grabbableKey\": { \"grabbable\": false} }"
});
// self destruct the script after the entity is spawned
Script.stop();
