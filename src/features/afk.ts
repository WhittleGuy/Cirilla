import { Client } from 'discord.js'
import { ColorCheck } from '../helpers'
import afkSchema from '../models/afk-schema'

export default async (client: Client) => {
  client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return
    msg.mentions.members.forEach(async (member) => {
      const results = await afkSchema.findById(member.id)
      if (results && results.afk) {
        msg.reply({
          embeds: [
            {
              color: ColorCheck('PLAIN'),
              author: {
                name: `${member.user.tag} is currently AFK`,
                iconURL: member.user.displayAvatarURL(),
              },
              description: results.text,
            },
          ],
        })
      }
    })
  })
}

export const config = {
  displayName: 'AFK Message',
  dbName: 'AFK_MESSAGE',
}
