import { Client, Intents } from 'discord.js'
import WOKCommands from 'wokcommands'
import dotenv from 'dotenv'
import path from 'path'
import { ColorCheck } from './helpers/ColorCheck'

dotenv.config()

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
  client.user.setPresence({
    activities: [{ name: '/commands', type: 0 }],
    status: 'dnd',
  })

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
            color: ColorCheck(),
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
