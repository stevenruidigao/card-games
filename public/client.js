var socket = io.connect();
socket.on("connected", function(uuid) {
    var id = uuid;
    console.log('Connected successfully to the socket.io server. My server side ID is ' + id);
});
socket.on("play", function(data) {
  // console.log(card);
    var id = data.id;
    var card = data.card;
    // console.log(card);
    // console.log(id + " plays " + card);
    if (document.getElementById(card).style.backgroundImage == 'url("/cards/0000.svg")') {
        document.getElementById(card).style.backgroundImage = "url('/cards/" + card + ".svg')";
    } else {
        document.getElementById(card).style.backgroundImage = "url('/cards/0000.svg')";
    }
});
socket.on("chat", function(message) {
    var messages = document.getElementById("messages");
    var messagebox = document.createElement("P");
    var text = document.createTextNode(message);
    messagebox.appendChild(text);
    messages.appendChild(messagebox);
    console.log(message);
        // var time = new Date();
        // console.log(time.getHours() + ":" + time.getMinutes() + ": " + data)
});
socket.on("reload", function() {
    socket.emit("reload");
});
socket.on("refresh", function(gameData) {
    // cards = gameData.(socket.id);
    // console.log(gameData);
    // gameData.sort();
    var cards = document.getElementById("cards");
    while (cards.hasChildNodes()) {
        cards.removeChild(cards.lastChild);
    }
    for (var i = 0; i < gameData.length; i ++) {
        var card = document.createElement("div");
        card.id = gameData[i];
        card.className = "card";
        card.draggable = true;
        card.onclick = function (e) {
            // console.log(e);
            play(e.target.id);
        };
        card.style.backgroundImage = "url('/cards/" + card.id + ".svg')";
        // console.log(card);
        cards.appendChild(card);
    }
    // for (i = 0; i < cards.childNodes.length; i ++) {
    //     console.log(cards.childNodes);
    //     cards.removeChild(cards.childNodes[i]);
    // }
    console.log("cleared");
    // console.log(card);
});
function chat(message) {
	if (message != "") {
		socket.emit("chat", message);
	} 
}
function play(card) {
    socket.emit("play", card);
}
function name(name) {
    if (name.replace(/\s/g, "")	== "") {
        socket.emit("name", "Anonymous");
    } else {
        socket.emit("name", name);
    }
}
function submitName(e) {
    if (e.keyCode == 13 || e == 0) {
        var input = document.getElementById("username");
        var ubutton = document.getElementById("unb");
        var chat = document.getElementById("chat");
        name(input.value);
        input.hidden = "true";
        ubutton.hidden = "true";
        chat.removeAttribute("hidden");
    }
}
function submit(e) {
    var message = document.getElementById("chat");
    if (e.keyCode == 13 || e == 0) {
        chat(message.value);
        message.value = "";
    }
}
function hideChat() {
    var chatbar = document.getElementById("chat-bar");
    var max = document.getElementById("max");
    chatbar.setAttributeNode(document.createAttribute("hidden"));
    max.removeAttribute("hidden");
}
function showChat() {
    var chatbar = document.getElementById("chat-bar");
    var max = document.getElementById("max");
    max.setAttributeNode(document.createAttribute("hidden"));
    chatbar.removeAttribute("hidden");
}
