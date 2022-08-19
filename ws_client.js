ws_config = {
    server_address: "127.0.0.1", //by default: localhost address
    server_port: "8080", //by default
};

var wsSocket;

var username;

function WSConnection() {
    ws_config["server_address"] = document.getElementById("server-address").value;
    ws_config["server_port"] = document.getElementById("server-port").value;

    var server_address = ws_config["server_address"];
    var server_port = ws_config["server_port"];

    var ws_string = "ws://" + server_address + ":" + server_port;

    console.log("Connection to : " + ws_string);

    try {
        wsSocket = new WebSocket(ws_string);

        wsSocket.addEventListener("open", (event) => {
            document.getElementById("connection-error-label").textContent = "";
            document.getElementById("WS-modal").style.display = "none";
            document.getElementById("Room-modal").style.display = "block";
        });

        wsSocket.addEventListener("error", function(event) {
            console.log("Error : ", event);
            document.getElementById("connection-error-label").textContent =
                "Connection Error: Server not reachable";
        });

        wsSocket.addEventListener("message", function(event) {
            console.log("Message received from the server", event.data);
            var dataJSON = JSON.parse(event.data);
            var topic = dataJSON.topic;
            var code = dataJSON.code;
            console.log(topic);
            if (topic == "BcMsg") {
                if (code == username) {
                    var msgReceivedDiv = document.createElement("div");
                    msgReceivedDiv.className = "own-msgReceivedDiv";
                    document.getElementById("chatHistory").appendChild(msgReceivedDiv);
                    var msgBubble = document.createElement("div");
                    msgBubble.className = "own-msgBubble";
                    msgBubble.textContent = dataJSON.msg;
                    msgReceivedDiv.appendChild(msgBubble);
                } else {
                    var msgReceivedDiv = document.createElement("div");
                    msgReceivedDiv.className = "msgReceivedDiv";
                    document.getElementById("chatHistory").appendChild(msgReceivedDiv);
                    var msgBubble = document.createElement("div");
                    msgBubble.className = "msgBubble";
                    msgBubble.textContent = dataJSON.msg;
                    msgReceivedDiv.appendChild(msgBubble);
                }
            } else if (topic == "issue") {
                var errorMsg;
                switch (code) {
                    case "rnau":
                        errorMsg = "The room name is already used";
                        break;
                    case "wrongpwd":
                        errorMsg = "Wrong Password";
                        break;
                    case "rde":
                        errorMsg = "The room doesn't exist";
                        break;
                    case "uau":
                        errorMsg = "The username is already used in the room";
                        break;
                    default:
                        errorMsg = "Uncaught error";
                }
                document.getElementById("room-connection-error-label").textContent =
                    errorMsg;
            } else if (topic == "room") {
                document.getElementById("room-connection-error-label").textContent = "";
                document.getElementById("Room-modal").style.display = "none";
            }
        });
        // TODO disconnection event listener (in the server side): send that the user has disconnected to all other users in the chat room
        // TODO disconnection event listener: reset function call: WSsocket.close + display the WS-modal + message: "You've been disconnected from the server"
    } catch {
        document.getElementById("connection-error-label").textContent =
            "Connection Error: Be sure that the credentials entered have a correct format";
    }
}

function CreateRoom() {
    if (wsSocket.readyState == WebSocket.OPEN) {
        var roomName = document.getElementById("room-name").value;
        var roomPwd = document.getElementById("room-pwd").value;
        username = document.getElementById("username").value;
        var topic = "CreateRoom";
        var msg = {
            topic: topic,
            name: roomName,
            pwd: roomPwd,
            username: username,
        };
        console.log(msg);
        wsSocket.send(JSON.stringify(msg));
    }
}

function JoinRoom() {
    if (wsSocket.readyState == WebSocket.OPEN) {
        var roomName = document.getElementById("room-name").value;
        var roomPwd = document.getElementById("room-pwd").value;
        username = document.getElementById("username").value;
        var topic = "JoinRoom";
        var msg = {
            topic: topic,
            name: roomName,
            pwd: roomPwd,
            username: username,
        };
        wsSocket.send(JSON.stringify(msg));
    }
}

function SendMessage() {
    var chatBox = document.getElementById("chatBox");
    var msg = { sender: username, topic: "BcMsg", BcMsg: chatBox.value };
    wsSocket.send(JSON.stringify(msg));
    // TODO erase message in the box
}