import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'

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

  callback: async ({ guild, message, client, interaction }) => {
    const idReg = /\d{18}/
    let channel, messageId, content
    if (message) {
      const text = message.content.split(' ').slice(1)
      channel = guild.channels.cache.get(idReg.exec(text[0])[0])
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
    if (channel.type !== 'GUILD_TEXT')
      return FailureEmbed(interaction, 'Invalid channel')

    // Get message
    const targetMessage = await channel.messages.fetch(messageId, {
      cache: true,
      force: true,
    })

    // Validate message
    if (!targetMessage) return 'Something went wrong'
    if (targetMessage.author.id !== client.user.id) {
      if (interaction) FailureEmbed(interaction)
      else return 'Invalid messageId'
    }

    // Edit message
    await targetMessage.edit({ content: content }).catch(() => {
      if (interaction) FailureEmbed(interaction)
      else return 'Error editing message'
    })

    if (interaction) SuccessEmbed(interaction)
    else {
      message.reply({ content: 'Message updated' }).then((reply) => {
        message.delete()
        setTimeout(() => reply.delete(), 3000)
      })
    }
  },
} as ICommand
