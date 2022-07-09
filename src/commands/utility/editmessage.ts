import { ICommand } from 'wokcommands'
import { FailureMessage, SendError, SuccessMessage } from '../../helpers'

export default {
  category: 'Utility',
  description: 'Edit a post made with /say',
  permissions: ['MANAGE_MESSAGES'],
  // requireRoles: true,
  slash: 'both',
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'channel',
      description: 'Channel message is in',
      type: 7,
      required: true,
    },
    {
      name: 'message',
      description: 'MessageId',
      type: 3,
      required: true,
    },
    {
      name: 'content',
      description: 'New message',
      type: 3,
      required: true,
    },
  ],

  callback: async ({ guild, message, client, interaction, member }) => {
    const idReg = /\d{18}/
    let channel, messageId, content
    if (message) {
      const text = message.content.split(' ').slice(1)
      const channelId = idReg.exec(text[0])[0] || null
      if (channelId === null)
        return FailureMessage(message, 'Tag a text channel')
      channel = guild.channels.cache.get(channelId)
      messageId = text[1]
      content = text.slice(2).join(' ')
    } else {
      await interaction.deferReply({ ephemeral: true })

      // Get channel
      channel = interaction.options.getChannel('channel')
      messageId = interaction.options.getString('message')
      content = interaction.options.getString('content')
    }
    // Validate channel
    if (channel.type !== 'GUILD_TEXT') {
      return FailureMessage(message || interaction, 'Invalid channel')
    }

    // Get message
    const targetMessage = await channel.messages.fetch(messageId, {
      cache: true,
      force: true,
    })

    // Validate message
    if (!targetMessage) {
      return FailureMessage(message || interaction, 'Invalid messageId')
    }
    if (targetMessage.author.id !== client.user.id) {
      return FailureMessage(message || interaction, 'Invalid message')
    }

    // Edit message
    try {
      await targetMessage.edit({ content: content })
    } catch (err) {
      SendError('editmessage.ts', guild, member, err)
      return FailureMessage(message || interaction, `${err}`)
    }

    SuccessMessage(message || interaction)
  },
} as ICommand
