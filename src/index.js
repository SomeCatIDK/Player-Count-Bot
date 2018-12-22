const discord = require('discord.js')
const express = require('express')
const bodyParser = require('body-parser')

const webApp = express()
const discordClient = new discord.Client()

const token = process.env.TOKEN
const port = 5000

if (!token) {
  console.log('Please set the enviroment variable \'TOKEN\' to your bot\'s Discord token.')
  process.exit(1)
}

webApp.use(bodyParser.json())

webApp.post('/', async (req, res) => {
  console.log(req.body)

  if (req.body.currentPlayers === undefined || req.body.maxPlayers === undefined) {
    let err = { error: 'Bad request body.' }
    res.status(400).send(JSON.stringify(err))
    return
  }

  let statusCode = 200

  await setDiscordStatus(req.body.currentPlayers, req.body.maxPlayers).catch(error => {
    console.error(error)
    statusCode = 500
  })

  res.status(statusCode).send()
})

discordClient.on('ready', async () => {
  await setDiscordStatus(0, 0).catch(console.error)
  webApp.listen(port)

  console.log('Ready!')
})

discordClient.login(token)

async function setDiscordStatus (currentPlayers, maxPlayers) {
  await discordClient.user.setActivity(`${currentPlayers} / ${maxPlayers} Online Players!`, { type: 'WATCHING' })
}
