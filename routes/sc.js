var express = require('express');
var router = express.Router();
var osc = require('osc');
var debug = require('debug')('http');


function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
}
/* Send OSC packet */
router.get('/', function(req, res, next) {

        if (!global.udpPort) {
        // Create an osc.js UDP Port listening on port 57121.

        global.udpPort = new osc.UDPPort({
            localAddress: "127.0.0.1",
            localPort: 57121,
            metadata: true
        });

        // Open the socket.
        udpPort.open();
        // Listen for incoming OSC messages.
        global.udpPort.on("message", function (oscMsg, timeTag, info) {
            console.log("An OSC message just arrived!", oscMsg);
            console.log("Remote info is: ", info);
        });

        // When the port is read, send an OSC message to, say, SuperCollider
        global.udpPort.on("ready", function () {
            global.udpPort.send({
                address: "/s_new",
                args: [
                    {
                        type: "s",
                        value: "default"
                    },
                    {
                        type: "i",
                        value: global.nodeId
                    },
                    {
                        type: "i",
                        value: between(50,200)
                    },
                    {
                        type: "i",
                        value: between(50,200)
                    },
                    {
                        type: "i",
                        value: between(50,200)
                    }
                ]
            }, "127.0.0.1", 57110);
                console.log("Sending OSC msg");
        });
    }

    global.udpPort.send({
        address: "/s_new",
        args: [
            {
                type: "s",
                value: "default"
            },
            {
                type: "i",
                value: global.nodeId++
            },
            {
                type: "i",
                value: between(50,200)
            },
            {
                type: "i",
                value: between(50,200)
            },
            {
                type: "i",
                value: between(50,200)
            }       
        ]
    }, "127.0.0.1", 57110);

    console.log(`[OSC] Sending /s_new with nodeID: ${global.nodeId}`);
    res.send({status:"ok"});

});

module.exports = router;
