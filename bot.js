const config = require('./config.json');
const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
var message;

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    
});

function newOrder () {

}

client.login(auth.token);

var orders;

// stringify JSON Object
var jsonContent = JSON.stringify();
console.log(jsonContent);

fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
});

