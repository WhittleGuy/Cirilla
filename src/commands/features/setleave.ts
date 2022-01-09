import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'
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
    await interaction.deferReply()
    const channel = interaction.options.getChannel('channel')
    if (channel.type !== 'GUILD_TEXT')
      return FailureMessage(interaction, 'Please tag a text channel')

    const set = await leaveSchema.findOneAndUpdate(
      {
        _id: guild.id,
      },
      {
        _id: guild.id,
        channelId: channel.id,
      },
      { upsert: true }
    )

    if (!set) return FailureMessage(interaction)
    return SuccessMessage(interaction)
  },
} as ICommand
