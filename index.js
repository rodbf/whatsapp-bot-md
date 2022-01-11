const hotswap = require('hotswap');
const QRCode = require('qrcode');
const fs = require('fs');
const {Client} = require('whatsapp-web.js');
let commands = require('./commands');

const SESSION_FILE_PATH = './session.json';
let debuggingNextMessage = false;

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)){
    sessionData = require(SESSION_FILE_PATH);
}
const client = new Client({puppeteer: {executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true}, clientId: 'rblivin-whatsbot'});

client.on('qr', (qr) => {
    renderQR(qr);
});

client.on('authenticated', (session) => {
    console.log("AUTHENTICATED");
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

function renderQR(qr){
    QRCode.toString(qr,{type:'terminal'}, function (err, url) {
      console.log(url);
    })
};

client.on('message_create', async msg => {
    if(fs.existsSync("./self.json") && (getSender(msg) == require("./self.json").number)){
        msg.author = require("./self.json").id;
        commands(msg);
    }
});

client.on('message', async msg => {
    commands(msg);
});

function getSender(msg){
    return (msg.from.split("@")[0]).split("-")[0];
}