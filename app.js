//Welcome to the guts of Nutella!
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
//routes and stuff

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
	deal(players) {
		var out = [];
		var i;
		for (i = 0; i < players.length; i ++) {
			out.push([]);
		}
		for (i = 0; i < (this.array.length - (this.array.length % players.length)); i ++) {
			var n = i % players.length;
			console.log(this.array[i]);
			out[n].push(this.array[i]);
			players[n].push(this.array[i]);
		}
		for (i = 0; i < players.length; i ++) {
			out[i].sort();
			players[i].sort();
		}
		return out;
	}
}

class Game {
	constructor(name, pass) {
		this.id = UUID();
		this.name = name;
		this.hasPassword = false;
		this.started = false;
		this.pass = "none";
		if (pass) {
			this.hasPassword = true;
			this.pass = pass;
		}
		this.deck = new Deck();
		this.players = new Map();
	}
	addPlayer(id) {
		if (!this.started) {
			this.players.set(id, []);
		}
	}
	start() {
		this.started = true;
	}
}


games = [];
players = [];

io.on("connection", (socket) => {
    socket.id = UUID();
    socket.name = socket.id;
    socket.emit("connected", socket.id);
    console.log("Player " + socket.name + " joined");
    // socket.broadcast.emit("chat", socket.name + " joined");
    players.push(socket.id);
    // console.log(players);
	// DEAL
    // console.log(hands.dealt);
    socket.broadcast.emit("reload");
    socket.on('disconnect', function() {
        console.log(socket.name + " disconnected");
        players.splice(players.indexOf(socket.id), 1);
        socket.broadcast.emit("reload");
    });
    socket.on("name", function(name) {
        if (name.toLowerCase() != "anonymous") {
            socket.broadcast.emit("chat", name + " joined the chat!");
        }
        socket.name = name;
    });
    // socket.on("reload", function() {
    //    socket.emit("refresh", hands.dealt.get(socket.id));
        // console.log(hands.dealt.get(socket.id));
    // });
    socket.on("play", function(card) {
        // console.log("play " + card);
        if (hands.dealt.get(socket.id).includes(card)) {
            socket.broadcast.emit("play", {id : socket.id, card : card});
            // socket.emit("play", card);
        }
    });
    socket.on("chat", function(message) {
		if (message != "") {
			console.log(socket.name + ": " + message);
			socket.broadcast.emit("chat", socket.name + ": " + message);
			// socket.emit("chat", {id: socket.id, message: message});
		}
	});
});