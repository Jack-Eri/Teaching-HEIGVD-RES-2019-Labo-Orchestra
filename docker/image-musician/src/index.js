const uuid = require("uuid");
const dgram = require("dgram");

const PORT = 2205;
const MULTICAST_ADDRESS = "239.255.22.5";

var instruments = [
    {name: "piano", sound: "ti-ta-ti"},
    {name: "trumpet", sound: "pouet" },
    {name: "flute", sound: "trulu"},
    {name: "violin", sound: "gzi-gzi"},
    {name: "drum", sound: "boum-boum"}
]

function soundOf(name) {

    var instrument = instruments.find((instrument) => instrument.name == name);

    if (instrument) {
        return instrument.sound;
    }

    return null;
}

// Check if the given instrument has a sound.
const sound = soundOf(process.argv[2]);
if (!sound) {
    console.log("Unkown instrument.");
    process.exit();
}

const musician = {
    uuid: uuid.v1(),
    sound: sound
}

const message = Buffer.from(JSON.stringify(musician));

const socket = dgram.createSocket("udp4");
setInterval(() => socket.send(message, 0, message.length, PORT, MULTICAST_ADDRESS, (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Sending " + message);
    }
}), 1000);