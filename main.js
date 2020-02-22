//https://discordapp.com/oauth2/authorize?client_id=678043677540614145&scope=bot&permissions=8

const config = require('./package.json');
const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
let doNotListenUsers;


function saveJSON(str, jsonContent) {

    fs.writeFile(str, jsonContent, {flag: "w" }, function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file has been saved.");
    });
}

function newOrder(input) {
    let itemWant;
    let itemGive;
    let ign;
    let user = input.author;


    input.channel.send("Now, enter your ingame name.");

   let filter = m => (m.author.id === input.author.id) && (input.author !== client.user.bot);


    input.channel.awaitMessages(filter, {maxMatches:1, time : 1000000, errors:['time']})
        .then(collected => {
            console.log(collected.first().content);
            ign = collected.first().content;
            input.channel.send("Now, enter the name of the item you want.");
            input.channel.awaitMessages(filter, {maxMatches:1, time : 1000000, errors:['time']})
                .then(collected => {
                    console.log(collected.first().content);
                    itemWant = collected.first().content;
                    input.channel.send("Now, enter the name of the item you will give.");
                    input.channel.awaitMessages(filter, {maxMatches:1, time : 1000000, errors:['time']})
                        .then(collected => {
                            console.log("test");
                            console.log(collected.first().content);
                            itemGive = collected.first().content;
                            let orderData = {
                                "itemWant": itemWant, "itemGive" : itemGive, "ign" : ign, "user" : user
                            };
                            console.log('test');
                            saveJSON("./orders/" + config.orderCount + ".json", JSON.stringify(orderData));
                            console.log('test');
                        })
                        .catch(collected => {
                            input.channel.send("Timed out");
                            return;

                        });
                })
                .catch(collected => {
                    input.channel.send("Timed out");
                    return;
                });
        })
        .catch(collected => {
            input.channel.send("Timed out");
            return;
        });
}

function command(input) {
    switch (true) {
        case input.content.includes('!order'):
            newOrder(input);
            break;

    }
}

client.once('ready', () => {
    console.log('Ready!');
});

function main () {

    client.on('message', message => {
        if (message.author === client.user.bot) return;
        console.log(message.content + " Is a message");
        command(message);
    });
}

client.login(auth.token);
main();
