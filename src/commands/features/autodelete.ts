import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'
import autoDeleteSchema from '../../models/auto-delete-schema'

export default {
  category: 'Configuration',
  description: 'Set an autoDelete channel and time',
  permissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'enable',
      description: 'Enable auto deletion of messages in a channel',
      type: 1,
      options: [
        {
          name: 'channel',
          description: 'Leave notification channel',
          type: 7,
          required: true,
        },
        {
          name: 'timeout',
          description:
            'Time in seconds to wait before deleting a message (Default: 10)',
          type: 3,
          required: false,
        },
      ],
    },
    {
      name: 'disable',
      description: 'Disable auto deletion of messages in a channel',
      type: 1,
    },
  ],

  callback: async ({ guild, interaction }) => {
    await interaction.deferReply({ ephemeral: true })
    // Enable an autoDelete channel
    if (interaction.options.getSubcommand() === 'enable') {
      // Validate channel
      const channel = interaction.options.getChannel('channel')
      if (channel.type !== 'GUILD_TEXT')
        return FailureMessage(interaction, 'Tag a text channel')
      // Validate timeout
      let timeout = interaction.options.getString('timeout') as string | number
      if (timeout) {
        if (!Number(timeout))
          return FailureMessage(interaction, 'Invalid timeout')
      }

      // Set in database
      const set = await autoDeleteSchema.findOneAndUpdate(
        {
          _id: guild.id,
        },
        {
          _id: guild.id,
          channelId: channel.id,
          timeout: timeout ? Number(timeout) * 1000 : 10000,
        },
        { upsert: true }
      )

      if (set) return SuccessMessage(interaction)
    }

    // Disable
    if (interaction.options.getSubcommand() === 'disable') {
      const set = await autoDeleteSchema.findOneAndDelete({
        _id: guild.id,
      })

      if (set) return SuccessMessage(interaction)
    }
  },
} as ICommand
