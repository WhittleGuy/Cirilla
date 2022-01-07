import { Client, Role, TextChannel } from 'discord.js'
import leaveSchema from '../models/leave-schema'

const leaveData = {} as {
  // guildId: [channel, message]
  [key: string]: [TextChannel, string]
}

export default (client: Client) => {
  client.on('guildMemberRemove', async (member) => {
    const { guild, id } = member

    let data = leaveData[guild.id]

    if (!data) {
      const results = await leaveSchema.findById(guild.id)
      if (!results) return

      const { channelId, text } = results
      const channel = guild.channels.cache.get(channelId) as TextChannel
      data = leaveData[guild.id] = [channel, text]
    }

    data[0].send({
      embeds: [
        {
          title: `${member.user.tag} left the server`,
          color: 0xff0000,
          thumbnail: { url: member.user.displayAvatarURL() },
          fields: [
            {
              name: 'Bot',
              value: member.user.bot ? 'True' : 'False',
              inline: true,
            },
            {
              name: 'Joined',
              value:
                new Date(member.joinedAt).toLocaleDateString() +
                '\n' +
                new Date(member.joinedAt).toLocaleTimeString(),
              inline: true,
            },
            {
              name: 'Time in Server',
              value: `${(
                (new Date().getTime() - new Date(member.joinedAt).getTime()) /
                (1000 * 3600 * 24)
              ).toFixed(2)} days`,
              inline: true,
            },
            {
              name: 'Roles',
              value: member.roles.cache
                .map((role: Role) => role)
                .slice(0, -1)
                .join(' '),
              inline: true,
            },
          ],
          footer: {
            text: `Id: ${id}`,
          },
          timestamp: new Date(),
        },
      ],
      allowedMentions: {
        users: [],
      },
    })
  })
}

export const config = {
  displayName: 'Leave Channel',
  dbName: 'LEAVE_CHANNEL',
}
