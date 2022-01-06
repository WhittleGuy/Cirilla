import DiscordJS, { Intents } from 'discord.js'
import WOKCommands from 'wokcommands'
import dotenv from 'dotenv'
import path from 'path'

import Revolver from './classes/Russian'

dotenv.config()

export const REVOLVER = new Revolver()

const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
})

client.on('ready', () => {
  console.log(`[+] Connected to Discord as ${client.user.tag}`)
  client.user.setActivity('/help')

  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    typeScript: true,
    testServers: '701879717015584881',
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
            description: 'Use /help to get a list of commands',
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
