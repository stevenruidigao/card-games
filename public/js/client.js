document.getElementById('enableJS').hidden = true;
let deferredPrompt;
var installbtn = document.getElementById("installbtn");
window.addEventListener('beforeinstallprompt', (e) => {
	// Prevent Chrome 67 and earlier from automatically showing the prompt
	e.preventDefault();
	// Stash the event so it can be triggered later.
	deferredPrompt = e;
	// Update UI notify the user they can add to home screen
	console.log(e);
	installbtn.style.display = 'block';
});

installbtn.addEventListener('click', (e) => {
	// hide our user interface that shows our A2HS button
	installbtn.style.display = 'none';
	// Show the prompt
	deferredPrompt.prompt();
	// Wait for the user to respond to the prompt
	deferredPrompt.userChoice
    .then((choiceResult) => {
		if (choiceResult.outcome === 'accepted') {
			console.log('User accepted the A2HS prompt');
		} else {
			console.log('User dismissed the A2HS prompt');
		}
		deferredPrompt = null;
    });
});
if (window.online) {
    showChat();
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
	socket.on("join", function(gameID) {
		socket.game = gameID;
	});
	socket.on("hands", function(gameData) {
		console.log("hands");
		console.log(gameData);
	});
	/* socket.on("refresh", function(gameData) {
		
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
		    // console.log(cards.childNodes);
		    // cards.removeChild(cards.childNodes[i]);
		// }
		console.log("cleared");
		// console.log(card);
	}); */
	function join(gameID, pass) {
		socket.emit("join", {
			"id": gameID,
			"pass": pass
		});
		socket.game = gameID;
	}
	function createGame(name, pass) {
		socket.emit("createGame", {
			"name": name,
			"pass": pass
		});
	}
	function startGame() {
		socket.emit("start");
	}
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
	function showChat() {
		var chatbar = document.getElementById("chat-bar");
		var max = document.getElementById("max");
		max.style.display = "none";
		chatbar.style.display = "block";
	}
}
function hideChat() {
    var chatbar = document.getElementById("chat-bar");
    var max = document.getElementById("max");
    chatbar.style.display = "none";
	max.style.display = "block";
}
function closeChat() {
    var chatbar = document.getElementById("chat-bar");
    chatbar.style.display = "none";
}
