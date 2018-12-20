const discord = require ('discord.js');
const express = require ('express');
const bodyParser = require('body-parser');

const webApp = express();
const discordClient = new discord.Client();

var token = process.env.TOKEN;

if (!token){
    console.log('Please set the enviroment variable \'TOKEN\' to your bot\'s Discord token.');
    process.exit(1);
}

webApp.use(bodyParser.json());

webApp.post('/', async (req, res) => {
    console.log(req.body);

    if (req.body.currentPlayers == undefined || req.body.maxPlayers == undefined){
        let err = {error: 'Bad request body.'}
        res.status(400).send(JSON.stringify(err));
        return;
    }

    await setDiscordStatus(req.body.currentPlayers, req.body.maxPlayers);
    res.status(200).send();
});

discordClient.on('ready', async () => {
    await setDiscordStatus(0, 0);
    webApp.listen(5000);

    console.log('Ready!');
});

discordClient.login(token);

async function setDiscordStatus(currentPlayers, maxPlayers){
    await discordClient.user.setActivity(`${currentPlayers} / ${maxPlayers} Online Players!`, {type: 'WATCHING'});
}