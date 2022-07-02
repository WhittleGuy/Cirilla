import { Client } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'
import autoDeleteSchema from '../../models/auto-delete-schema'

const autoDeleteData = {} as {
  // guildId: [channelId, timeout]
  [key: string]: [string, number]
}

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
          description: 'auto-delete channel',
          type: 4,
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

  init: async (client: Client) => {
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
        setTimeout(
          () => {
            try {
              message
                .delete()
                .catch((err) => console.log('AutoDelete Error: ' + err))
            } catch (err) {
              console.log('AutoDelete Error: ' + err)
            }
          },

          data[1]
        )
      }

      return
    })
  },

  callback: async ({ guild, interaction }) => {
    await interaction.deferReply({ ephemeral: true })
    // Enable an autoDelete channel
    if (interaction.options.getSubcommand() === 'enable') {
      // Validate channel
      const channel = interaction.options.getChannel('channel')
      if (channel.type !== 'GUILD_TEXT')
        return FailureMessage(interaction, 'Tag a text channel')
      // Validate timeout
      let timeout = Number(interaction.options.getString('timeout'))

      // Set in database
      const set = await autoDeleteSchema.findOneAndUpdate(
        {
          _id: guild.id,
        },
        {
          _id: guild.id,
          channelId: channel.id,
          timeout: timeout ? timeout * 1000 : 10000,
        },
        { upsert: true }
      )
      autoDeleteData[guild.id] = [channel.id, timeout ? timeout * 1000 : 10000]

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
