// Welcome to the guts of Nutella!
var express = require("express");
var UUID = require("uuid/v1");
var http = require("http");
var app = express();
var server = http.createServer(app);
var io = require("socket.io").listen(server);
server.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("Nutella is up!");
});

app.use(express.static("public"));
app.set("view engine", "ejs");
// routes and stuff

app.get("/", function(req, res){
    // res.sendFile(__dirname + "/client/index.html");
    res.render("home");
});

app.get("/faq", function(req, res) {
    res.render("faq");
});

app.get("/copyright", function(req, res) {
    res.render("copyright");
});

app.get("/socket.io", function(req, res) {
    res.sendfile(__dirname + "/socket.io" + req.params[0]);
});

app.get("*", function(req, res){
    res.redirect("/");
});

class Deck {
	constructor(jokers = false, cards = ["0401", "0402", "0403", "0404", "0405", "0406", "0407", "0408", "0409", "0410", "0411", "0412", "0413", "0301", "0302", "0303", "0304", "0305", "0306", "0307", "0308", "0309", "0310", "0311", "0312", "0313", "0201", "0202", "0203", "0204", "0205", "0206", "0207", "0208", "0209", "0210", "0211", "0212", "0213", "0101", "0102", "0103", "0104", "0105", "0106", "0107", "0108", "0109", "0110", "0111", "0112", "0113"]) {
		this.cards = cards;
		this.hands = [];
		if (jokers) {
			this.cards.push("9998", "9999");
		}
	}
	shuffle() {
		var m = this.cards.length, t, i;
		while (m) {
			// while m > 0
			i = Math.floor(Math.random() * m --);
			// index = randomnumber * (m - 1) (round down)
			// swap
			t = this.cards[m];
			this.cards[m] = this.cards[i];
			this.cards[i] = t;
		}
		return this.cards;
	}
	deal(players, hands, hiddenHands) {
		var i;
		for (i = 0; i < players; i ++) {
			hands.push([]);
			hiddenHands.push([]);
		}
		console.log(hands, hiddenHands);
		for (i = 0; i < (this.cards.length - (this.cards.length % players)); i ++) {
			var n = i % players;
			// console.log(this.cards[i]);
			hands[n].push(this.cards[i]);
			hiddenHands[n].push(UUID());
		}
		for (i = 0; i < players; i ++) {
			hands[i].sort();
		}
		console.log(players);
	}
}

class Game {
	constructor(id, name, pass) {
		this.id = id;
		this.name = name;
		this.hasPassword = false;
		this.started = false;
		this.pass = "none";
		if (pass) {
			this.hasPassword = true;
			this.pass = pass;
		}
		this.deck = new Deck();
		this.hands = [];
		this.hiddenHands = [];
		this.hostID = null;
		this.sockets = [];
		this.socketAssignments = new Map();
		this.newSocketIndex = 0;
	}
	join(socket, pass) {
		if (!this.started && (pass == this.pass || this.pass == "none")) {
			if (this.newSocketIndex == 0) {
				this.hostID = socket.id;
			}
			this.socketAssignments.set(socket.id, this.newSocketIndex);
			this.sockets.push(socket);
			this.newSocketIndex ++;
		}
	}
	start(socket) {
		if (socket.id == this.hostID && !this.started)  {
			this.started = true;
			this.deck.shuffle();
			this.deck.deal(this.sockets.length, this.hands, this.hiddenHands);
			// console.log(this.socketAssignments);
			for (var socket of this.sockets) {
				socket.emit("hands", {
					"hand": this.hands[this.socketAssignments.get(socket.id)],
					"hiddenHands": this.hiddenHands
				});
			}
		}
	}
	removePlayer(socket) {
		if (this.sockets.includes(socket)) {
			this.sockets.splice(this.sockets.indexOf(socket), 1);
			this.socketAssignments.delete(socket.id);
			this.newSocketIndex --;
		}
	}
}

games = new Map();
players = [];

io.on("connection", (socket) => {
    socket.id = UUID();
    socket.name = socket.id;
    socket.emit("connected", socket.id);
    console.log("Player " + socket.name + " joined");
    // socket.broadcast.emit("chat", socket.name + " joined");
    players.push(socket.id);
	
	socket.on("createGame", function (gameData) {
		console.log(gameData);
		id = UUID();
		game = new Game(id, gameData.name, gameData.pass);
		game.join(socket, gameData.pass);
		games.set(id, game);
		socket.game = game;
		socket.emit("join", game.id);
	});
	socket.on("join", function(game) {
		socket.game = games.get(game.id);
		if (socket.game) {
			socket.game.join(socket, game.pass);
		}
	});
	socket.on("start", function() {
		if (socket.game) {
			console.log("Game started");
			socket.game.start(socket);
		}
	});
    socket.on("disconnect", function() {
        console.log(socket.name + " disconnected");
        players.splice(players.indexOf(socket.id), 1);
		if (socket.game) {
			socket.game.removePlayer(socket);
		}
    });
    socket.on("name", function(name) {
        if (name.toLowerCase() != "anonymous") {
            socket.broadcast.emit("chat", name + " joined the chat!");
        }
        socket.name = name;
    });
    // socket.on("reload", function() {
		// socket.emit("refresh", hands.dealt.get(socket.id));
        // console.log(hands.dealt.get(socket.id));
    // });
    socket.on("play", function(card) {
        // console.log("play " + card);
        // if (hands.dealt.get(socket.id).includes(card)) {
			// socket.broadcast.emit("play", {id : socket.id, card : card});
            // socket.emit("play", card);
        // }
    });
    socket.on("chat", function(message) {
		if (message != "") {
			console.log(socket.name + ": " + message);
			socket.broadcast.emit("chat", socket.name + ": " + message);
			// socket.emit("chat", {id: socket.id, message: message});
		}
	});
});