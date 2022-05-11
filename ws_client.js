ws_config = {
    server_address: "127.0.0.1",
    server_port: "8080",
};

var server_address = ws_config["server_address"];
var server_port = ws_config["server_port"];

var ws_string = "ws://" + server_address + ":" + server_port;

var wsSocket = new WebSocket(ws_string);

wsSocket.addEventListener("message", function(event) {
    console.log("Message reçu du serveur ", event.data);
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

function CreateRoom(roomName, roomPwd) {
    if (wsSocket.readyState == WebSocket.OPEN) {
        var topic = "CreateRoom";
        var msg = { topic: topic, name: roomName, pwd: roomPwd };
        console.log(msg);
        wsSocket.send(JSON.stringify(msg));
    }
}

function SendMessage() {
    var chatBox = document.getElementById("chatBox");
    var msg = { topic: "BcMsg", BcMsg: chatBox.value };
    wsSocket.send(JSON.stringify(msg));
    console.log(JSON.stringify(msg));
}