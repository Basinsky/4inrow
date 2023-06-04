//
//  4inrow-client.js
//  
//  Created by Basinsky on 4-6 2023

//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

(function () {    
    var myID; 
    var clickOnce = true;
    var COOL_DOWN = 1000; // ms     

    this.preload = function (entityID) {
        myID = entityID;                      
    };
    // detect mouse clicks and triggers
    Entities.mousePressOnEntity.connect(function (entityID, event) {        
        if (event.isLeftButton && clickOnce) {   
            var avatarName = MyAvatar.displayName;           
            if (myID) {
                clickOnce = false;
                // send avatarname and clicked entity to the serverscript both entity and serverscript
                // are runnning on the same entity so we can use the same entityID for sending the data
                Entities.callEntityServerMethod(             
                    myID, 
                    "clicked", // this is the function in the serverscript where the data is send
                    [avatarName,entityID] // this is the data 
                );                
                // cool down click to send message every second
                Script.setTimeout(function () {
                    clickOnce = true;
                }, COOL_DOWN);                 
            }
        }
    });
});
