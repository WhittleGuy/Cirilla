import { Client, Intents } from 'discord.js'
import WOKCommands from 'wokcommands'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  partials: ['MESSAGE', 'CHANNEL'],
})

client.on('ready', async () => {
  console.log(`[+] Connected to Discord as ${client.user.tag}`)
  client.user.setPresence({
    activities: [{ name: '/commands', type: 0 }],
    status: 'online',
  })

  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    featuresDir: path.join(__dirname, 'features'),
    typeScript: true,
    testServers: ['1100894168542367744'],
    botOwners: ['191842871043817474'],
    mongoUri: process.env.MONGO_URI,
  })
})

// client.on('messageCreate', (msg) => console.log(msg.content))

client.login(process.env.TOKEN)
