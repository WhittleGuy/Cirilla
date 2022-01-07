import { Client, Intents } from 'discord.js'
import WOKCommands from 'wokcommands'
import dotenv from 'dotenv'
import path from 'path'

import Revolver from './classes/Russian'
import testSchema from './models/test-schema'

dotenv.config()

export const REVOLVER = new Revolver()

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
})

client.on('ready', async () => {
  console.log(`[+] Connected to Discord as ${client.user.tag}`)
  client.user.setActivity('/help')

  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    featuresDir: path.join(__dirname, 'features'),
    typeScript: true,
    testServers: ['701879717015584881'],
    botOwners: ['191842871043817474'],
    mongoUri: process.env.MONGO_URI,
  })
})

// Respond to @mentions
client.on('messageCreate', (msg) => {
  if (msg.author.bot) return
  if (msg.mentions.has(client.user.id)) {
    msg
      .reply({
        embeds: [
          {
            color: 0xff9ed7,
            description: 'Use /commands to get a list of commands',
          },
        ],
      })
      .then((res) => {
        setTimeout(() => res.delete(), 3000)
        setTimeout(() => msg.delete(), 3000)
      })
  }
})

client.login(process.env.TOKEN)
