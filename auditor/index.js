const dgram = require("dgram");
const moment = require('moment');
const net = require('net');

const socket = dgram.createSocket("udp4");

const PORT = 2205;
const MULTICAST_ADDRESS = "239.255.22.5";
const TCP_ADDRESS = "0.0.0.0";

var instruments = [
    {name: "piano", sound: "ti-ta-ti"},
    {name: "trumpet", sound: "pouet" },
    {name: "flute", sound: "trulu"},
    {name: "violin", sound: "gzi-gzi"},
    {name: "drum", sound: "boum-boum"}
]

function nameOf(sound) {

    var instrument = instruments.find((instrument) => instrument.sound == sound);

    if (instrument) {
        return instrument.name;
    }
    
    return null;
}

var musicians = new Map();

socket.bind(PORT, () => {
    socket.addMembership(MULTICAST_ADDRESS);
});
socket.on("message", (message) => {

    var data = JSON.parse(message.toString());
    var musician = {};

    if (musicians.get(data.uuid) == null) {

        musicians.set(data.uuid, musician);
        musician.instrument = nameOf(data.sound);
        musician.activeSince =  Date.now();
    }

    musicians.get(data.uuid).lastPlay = Date.now();
});

function musiciansJson() {
    var data = []
    musicians.forEach((val, key) => {

        if (Date.now() - val.lastPlay <= 5000) {

            data.push({
                uuid: key,
                instrument: val.instrument,
                activeSince: moment(val.activeSince).format()
            });
        }
    });
    return JSON.stringify(data);
}

// TCP server
const server = net.createServer();
server.listen(PORT, TCP_ADDRESS);

server.on('connection', (socket) => {
    socket.write(musiciansJson() + "\r\n");
    console.log("Musicians sent to client.");
    socket.end();
});
