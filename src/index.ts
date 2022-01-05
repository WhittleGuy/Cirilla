import DiscordJS, { Intents } from 'discord.js'
import WOKCommands from 'wokcommands'
import dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.Client({
  intents: (Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES),
})

client.once('ready', () => {
  console.log(`[+] Connected to Discord as ${client.user.tag}`)
  //client.user.setActivity(``)
})

client.login(process.env.TOKEN)
