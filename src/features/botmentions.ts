import { Client } from 'discord.js'
import { ColorCheck } from '../helpers'

export default async (client: Client) => {
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
}

export const config = {
  displayName: 'Bot Mentions',
  dbName: 'BOT_MENTIONS',
}
