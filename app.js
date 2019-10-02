//Welcome to the guts of Nutella!
var express = require("express");
var UUID = require("uuid/v1");
var fs = require('fs')
var httpx = require("./httpx");
var https = require("https");
var http = require("http");
var app = express();
// var httpxServer = httpx.createServer({
//   key: fs.readFileSync('Server.key'),
//   cert: fs.readFileSync('Server.crt')
// }, app);
// var httpsServer = https.createServer({
//   key: fs.readFileSync('Server.key'),
//   cert: fs.readFileSync('Server.crt')
// }, app);
var httpServer = http.createServer(app);
var io = require("socket.io").listen(httpServer);
// httpxServer.listen(process.env.PORT || 3002, process.env.IP, function(){
//     console.log("Card-games is up!");
// });
// httpsServer.listen(process.env.PORT || 3001, process.env.IP, function(){
//     console.log("Card-games is up!");
// });
httpServer.listen(process.env.PORT || 80, process.env.IP, function(){
    console.log("Card-games is up!");
});

// httpsServer.listen(443, process.env.IP, function() {
//     console.log("Card-games is up!");
// });

app.use(express.static("public"));
app.set("view engine", "ejs");
//routes and stuff

app.all("*", function (req, res, next) {
    if (!req.secure) {
//         console.log(req);
        res.render("certificate");
    } else next();
});
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

app.get("/game/:gameID", function(req, res) {
//     console.log(req.params.gameID);
    
    if (gameMap.has(req.params.gameID)) res.render("game"); 
    else res.redirect("/");
});

// app.get("/socket.io", function(req, res) {
//     res.sendFile(__dirname + "/socket.io" + req.params[0]);
// });

app.get("*", function(req, res){
    res.redirect("/");
});

class Deck {
	constructor(jokers = false, array = ["0401", "0402", "0403", "0404", "0405", "0406", "0407", "0408", "0409", "0410", "0411", "0412", "0413", "0301", "0302", "0303", "0304", "0305", "0306", "0307", "0308", "0309", "0310", "0311", "0312", "0313", "0201", "0202", "0203", "0204", "0205", "0206", "0207", "0208", "0209", "0210", "0211", "0212", "0213", "0101", "0102", "0103", "0104", "0105", "0106", "0107", "0108", "0109", "0110", "0111", "0112", "0113"]) {
		this.array = array;
		if (jokers) {
			this.array.push("SJ", "BJ");
		}
	}
	shuffle() {
		var m = this.array.length, t, i;
		while (m) {
			// while m > 0
			i = Math.floor(Math.random() * m--);
			// index = randomnumber * (m - 1) (round down)
			// swap
			t = this.array[m];
			this.array[m] = this.array[i];
			this.array[i] = t;
		}
		return this.array;
	}
    deal(gamePlayerIDMap) {
        var players = [];
        console.log(gamePlayerIDMap.keys());
		for (var id of gamePlayerIDMap.keys()) {
			players.push([]);
            console.log("***" + id);
		}
        console.log(players.length);
		for (var i = 0; i < (this.array.length - (this.array.length % players.length)); i ++) {
			var n = i % players.length;
// 			console.log(this.array[i]);
			players[n].push(this.array[i]);
		}
		for (var i = 0; i < gamePlayerIDMap.length; i ++) {
			players[i].sort();
		}
		return players;
	}
}

class Game {
	constructor(name, pass) {
		this.id = UUID();
		this.name = name;
		this.hasPassword = false;
		this.started = false;
		this.pass = pass;
        this.host = null;
		if (pass) {
			this.hasPassword = true;
			this.pass = pass;
		}
		this.deck = new Deck();
		this.playerIDMap = new Map();
        this.playerCardMap = new Map();
	}
	addPlayer(id) {
		if (!this.started) {
			this.playerIDMap.set(id, playerIDMap.get(id));
            console.log(this.playerIDMap.keys());
		}
	}
    removePlayer(id) {
        this.playerIDMap.delete(id);
    }
	start() {
		this.started = true;
        this.deck.shuffle();
        this.cards = this.deck.deal(this.playerIDMap);
        var currHand = 0;
        for (var id of this.playerIDMap.keys()) {
            this.playerCardMap.set(id, this.cards[currHand]);
            this.playerIDMap.get(id).emit("cards", this.cards[currHand]);
        }
	}
}


games = [];
gameMap = new Map();
gameIDMap = new Map();
playerIDMap = new Map();

io.on("connection", (socket) => {
    socket.id = UUID();
    socket.name = socket.id;
    socket.createGame = false;
    socket.game = null;
    socket.emit("connected", socket.id);
//     console.log("Player " + socket.name + " joined");
    playerIDMap.set(socket.id, socket);
    socket.emit("gamesList", Array.from(gameIDMap));
    socket.on("disconnect", function() {
        console.log(socket.id + " " + socket.name + " disconnected");
        var game = socket.game;
        if (game != null) {
            var gamePlayerIDMap = game.playerIDMap;
//             console.log(gamePlayerIDMap.keys());
            if (gamePlayerIDMap.size == 1) {// && !socket.createGame) {
                gamePlayerIDMap.delete(socket.id);
                setTimeout(function () {
                    gameMap.delete(game.id);
                    gameIDMap.delete(game.id);
                    console.log("deleted game " + game.id);
                    socket.broadcast.emit("gamesList", Array.from(gameIDMap));
                }, 5000);
            } else if (socket.id == gamePlayerIDMap.keys().next().value) { // gamePlayerIDMap.size >= 2 && 
//                 console.log(socket.game.playerIDMap.get(socket.id));
                gamePlayerIDMap.delete(socket.id);
//                 console.log(gamePlayerIDMap.keys().next().value);
//                 console.log(playerIDMap);
                playerIDMap.get(gamePlayerIDMap.keys().next().value).emit("host", game.id);
            } else {
                gamePlayerIDMap.delete(socket.id);
            }
        }
        playerIDMap.delete(socket.id);
//         socket.broadcast.emit("reload");
    });
    socket.on("name", function(name) {
        if (name.toLowerCase() != "anonymous") {
            socket.broadcast.emit("chat", name + " joined the chat!");
        }
        socket.name = name;
    });
    socket.on("newGame", function(name, pass) {
        if (name != "") {
            var newGame = new Game(name, pass);
//             socket.createGame = true;
            socket.game = newGame;
//             newGame.addPlayer(socket.id);
//             console.log(socket.game.playerIDMap.size);
//             console.log(newGame.id);
            socket.emit("joinGame", newGame.id);
            games.push(newGame);
            gameMap.set(newGame.id, newGame);
            gameIDMap.set(newGame.id, newGame.name);
            socket.broadcast.emit("gamesList", Array.from(gameIDMap));
            console.log("New Game " + name + " created with id " + newGame.id);
        }
        
    });
    socket.on("joinGame", function(id, pass) {
//         console.log(id);
//         console.log(gameMap.get(id).playerIDMap);
        var game = gameMap.get(id);
        if (game && (!game.hasPassword || pass == game.pass)) {
            if (game.playerIDMap.size == 0) socket.emit("host", id);
            socket.game = game;
            game.addPlayer(socket.id);
//             socket.emit("joinGame", game.id);
        }
//         console.log(gameMap.get(id).playerIDMap);
//         console.log(socket.game.playerIDMap.size);
    });
    socket.on("startGame", function () {
        var game = socket.game;
        if (game != null && game.playerIDMap.keys().next().value == socket.id) {
            game.start();
        }
    })
    socket.on("chat", function(message) {
		if (message != "") {
			console.log(socket.name + ": " + message);
			socket.broadcast.emit("chat", socket.name + ": " + message);
		}
	});
});