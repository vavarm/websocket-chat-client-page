ws_config = {
    server_address: "127.0.0.1", //by default: localhost address
    server_port: "8080", //by default
};

function WSConnection() {
    var server_address = ws_config["server_address"];
    var server_port = ws_config["server_port"];

    var ws_string = "ws://" + server_address + ":" + server_port;

    var wsSocket = new WebSocket(ws_string);

    //while the Room-modal is not open: animate a loading icon
}

wsSocket.addEventListener("open", (event) => {
    //go to Room-modal
});

wsSocket.addEventListener("error", function(event) {
    console.log("Error : ", event);
    document.getElementById("connection-error-label").textContent =
        "Connection Error";
});

wsSocket.addEventListener("message", function(event) {
    console.log("Message received from the server", event.data);
    var dataJSON = JSON.parse(event.data);
    var topic = dataJSON.topic;
    console.log(topic);
    if (topic == "BcMsg") {
        var msgReceivedDiv = document.createElement("div");
        msgReceivedDiv.className = "msgReceivedDiv";
        msgReceivedDiv.textContent = dataJSON.msg;
        document.getElementById("chatHistory").appendChild(msgReceivedDiv);
    }
});

//disconnection event listener

function CreateRoom(roomName, roomPwd) {
    if (wsSocket.readyState == WebSocket.OPEN) {
        var topic = "CreateRoom";
        var msg = { topic: topic, name: roomName, pwd: roomPwd };
        console.log(msg);
        wsSocket.send(JSON.stringify(msg));
    }
    //else: return to the WS-modal and put in the connection-error-label that the client was disconnected
}

//function JoinRoom()

function SendMessage() {
    var chatBox = document.getElementById("chatBox");
    var msg = { topic: "BcMsg", BcMsg: chatBox.value };
    wsSocket.send(JSON.stringify(msg));
    console.log(JSON.stringify(msg));
}