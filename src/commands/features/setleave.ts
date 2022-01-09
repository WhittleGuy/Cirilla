import { ICommand } from 'wokcommands'
import leaveSchema from '../../models/leave-schema'

export default {
  category: 'Configuration',
  description: 'Set the leave notification channel',
  permissions: ['MANAGE_CHANNELS'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'channel',
      description: 'Leave notification channel',
      type: 7,
      required: true,
    },
  ],

  callback: async ({ guild, interaction }) => {
    const channel = interaction.options.getChannel('channel')
    if (channel.type !== 'GUILD_TEXT') return 'Please tag a text channel'

    await leaveSchema.findOneAndUpdate(
      {
        _id: guild.id,
      },
      {
        _id: guild.id,
        channelId: channel.id,
      },
      { upsert: true }
    )

    return 'Leave channel set'
  },
} as ICommand
