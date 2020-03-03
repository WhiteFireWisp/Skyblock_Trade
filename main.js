//https://discordapp.com/oauth2/authorize?client_id=678043677540614145&scope=bot&permissions=8

const config = require('./package.json');
const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs').promises;
let doNotListenUsers;
const orderChannel = "681648921365577741";


function saveJSON(str, jsonContent) {

    fs.writeFile(str, jsonContent, {flag: "w" }, function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file has been saved.");
    });
}

function generateOrderEmbed(orderData, num) {
    const Embed = new Discord.RichEmbed()
        .setTitle(`Order #${num}`)
        .setColor("#4682b4")
        .addField('User:', `<@${orderData.user.id}>`)
        .addField('Item Giving', orderData.itemGive)
        .addField('Item Wanted', orderData.itemWant);
    return {embed:Embed};
}

function verifyUserExists(nm) {
    const https = require('https');
    const options = {
        hostname: 'hypixel.net',
        path: `/api/player/id?id=${nm}`,
        method: 'GET'
    };

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', d => {
            if(JSON.parse(d)["body"] !== "Player Not Found")  {
                fs.writeFile(`users/${JSON.parse(d).uuid}.json`,`{"uuid":"${JSON.parse(d).uuid}",\n"ign":"${JSON.parse(d).name}"`, {"flag":"w"});
                return true;
            } else {
                return false;
            }
        })
    });

    req.on('error', error => {
        console.error(error)
    });

    req.end();
}

function newOrder(input) {
    let orderData = {
        itemWant:"",
        itemGive:"",
        user:""
    };


    input.channel.send("Now, enter the name of the item you want.");

   let filter = m => (m.author.id === input.author.id) && (input.author !== client.user.bot);


    input.channel.awaitMessages(filter, {maxMatches:1, time : 1000000, errors:['time']})
    input.channel.awaitMessages(filter, {maxMatches:1, time : 1000000, errors:['time']})
                .then(collected => {
                    console.log(collected.first().content);
                    orderData.itemWant = collected.first().content;
                    input.channel.send("Now, enter the name of the item you will give.");
                    input.channel.awaitMessages(filter, {maxMatches:1, time : 1000000, errors:['time']})
                        .then(collected => {
                            console.log("test");
                            console.log(collected.first().content);
                            orderData.itemGive = collected.first().content;
                            orderData.user = input.author;
                            let orderMessageId;
                            client.channels.get(orderChannel).send(generateOrderEmbed(orderData, config.orderCount)).then(sent => {
                                orderMessageId = sent.id;
                            });
                            fs.writeFile('orders/0.json',`{"id":"${orderMessageId}",\n"itemWant":"${orderData.itemWant}",\n"itemGive":"${orderData.itemGive}",\n"user":${orderData.user.id}}`, {"flag":"w"});

                        })
                        .then(() => {
                            input.channel.send("Order Successful");
                        })
                        .catch(() => {
                            input.channel.send("Timed out");
                        })
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
        if (message.channel.id ===  "684209786325172458") {
            if(verifyUserExists(message.content)) message.author.addRole("684211436892717059");
            else message.author.send("Invalid, player does not exist, please enter valid name in the #verified channel");
        }
        else if (message.channel.id === "684209730331213854") {
            command(message);
        }
        console.log(message.content + " Is a message");
    });
}

client.login(auth.token);
main();
