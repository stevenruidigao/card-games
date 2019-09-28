var socket = io.connect();
socket.on("connected", function(uuid) {
    var id = uuid;
    console.log('Connected successfully to the socket.io server. My server side ID is ' + id);
});
socket.on("joinGame", function (id) {
    window.location.href = "/game/" + id;
})
socket.on("play", function(data) {
    var id = data.id;
    var card = data.card;
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
});
socket.on("gamesList", function(games) {
    games = new Map(games);
    console.log(games);
    var gamesList = document.getElementById("joinGame");
    if (gamesList != null) {
        while (gamesList.firstChild) {
            gamesList.removeChild(gamesList.firstChild);
        }
        for (var id of games.keys()) {
            if (!games.hasOwnProperty(id)) {
                var joinButton = document.createElement("BUTTON");
                var text = document.createTextNode("Join " + games.get(id));
                joinButton.id = id;
                joinButton.onclick = function() {joinGame(id)};
                joinButton.appendChild(text);
                gamesList.appendChild(joinButton)
            }
        }
    }
});

function loadCookies() {
    if (document.cookie != "") {
        console.log(document.cookie);
        name(document.cookie.split("username=")[1].split(";")[0]);
        hideNamer();
    }
}
function chat(message) {
	if (message != "") {
		socket.emit("chat", message);
	} 
}
function name(name) {
    if (name.replace(/\s/g, "")	== "") {
        socket.emit("name", "Anonymous");
        document.cookie = "username=Anonymous";
    } else {
        socket.emit("name", name);
        document.cookie = "username=" + name;
    }
    console.log(document.cookie);
}
function createGame() {
    var game = document.getElementById("createGame");
    newGame(game.value, null);
}
function newGame(name, pass) {
    socket.emit("newGame", name, pass);
}
function joinGame(id, pass) {
    socket.emit("joinGame", id, pass);
}
function hideNamer() {
    var input = document.getElementById("username");
    var ubutton = document.getElementById("unb");
    var chat = document.getElementById("chat");
    input.hidden = "true";
    ubutton.hidden = "true";
    chat.removeAttribute("hidden");
}
function submitName(e) {
    if (e.keyCode == 13 || e == 0) {
        var input = document.getElementById("username");
        var ubutton = document.getElementById("unb");
        var chat = document.getElementById("chat");
        name(input.value);
        hideNamer();
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
    var chatbar = document.getElementById("chatBar");
    var max = document.getElementById("max");
    chatbar.style.display = "none";
    max.removeAttribute("hidden");
}
function closeChat() {
    var chatbar = document.getElementById("chatBar");
    chatbar.style.display = "none";
}
function showChat() {
    var chatbar = document.getElementById("chatBar");
    var max = document.getElementById("max");
    max.setAttributeNode(document.createAttribute("hidden"));
    chatbar.style.display = "block";
}
