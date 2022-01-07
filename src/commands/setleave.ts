import { ICommand } from 'wokcommands'
import leaveSchema from '../models/leave-schema'

export default {
  category: 'Configuration',
  description: 'Set the leave channel',
  permissions: ['ADMINISTRATOR'],
  slash: true,
  testOnly: true,
  options: [
    {
      name: 'channel',
      description: 'The channel to send leave messages to',
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
