import { Client, TextChannel } from 'discord.js'
import { SendError } from '../helpers'
import autoDeleteSchema from '../models/auto-delete-schema'

const autoDeleteData = {} as {
  // guildId: [channel, message]
  [key: string]: [string, number]
}

export default async (client: Client) => {
  client.on('messageCreate', async (message) => {
    const { guild, channel } = message
    if (channel.type !== 'GUILD_TEXT') return

    let data = autoDeleteData[guild.id]

    if (!data) {
      const results = await autoDeleteSchema.findById(guild.id)
      if (!results) return

      const { channelId, timeout } = results
      data = autoDeleteData[guild.id] = [channelId, timeout]
    }

    if (channel.id !== data[0]) return
    else {
      try {
        setTimeout(() => message.delete(), data[1])
      } catch (err) {
        SendError('autodelete.ts', guild, null, err)
      }
    }

    return
  })
}

export const config = {
  displayName: 'AFK Message',
  dbName: 'AFK_MESSAGE',
}
