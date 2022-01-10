import { Client } from 'discord.js'
import autoDeleteSchema from '../models/auto-delete-schema'

export default async (client: Client) => {
  client.on('messageCreate', async (message) => {
    const { guild, channel } = message
    if (channel.type !== 'GUILD_TEXT') return

    const results = await autoDeleteSchema.findById(guild.id)
    if (!results) return

    const { channelId, timeout } = results
    const data = [channelId, timeout]
    console.log(data)

    if (channel.id !== data[0]) return
    else {
      setTimeout(() => message.delete(), data[1])
    }

    return
  })
}

export const config = {
  displayName: 'AFK Message',
  dbName: 'AFK_MESSAGE',
}
