import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'

export default {
  category: 'Utility',
  description: 'Edit a post made with /embed',
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
      name: 'title',
      description: 'Embed title',
      type: 3,
      required: false,
    },
    {
      name: 'description',
      description: 'Embed description',
      type: 3,
      required: false,
    },
  ],

  callback: async ({ guild, message, client, interaction }) => {
    const idReg = /\d{18}/
    let channel, messageId, title, description

    // Standard command
    if (message) {
      const text = message.content.split(' ').slice(1)
      const channelId = idReg.exec(text[0])[0] || null
      if (channelId === null) return await message.reply('Tag a text channel')
      channel = guild.channels.cache.get(channelId)
      messageId = idReg.exec(text[1])[0] || null
      if (messageId === null) return await message.reply('Missing messageId')
      const content = text.slice(2).join(' ').split('|')
      title = content[0] || null
      description = content[1] || null
    }
    // Slash command
    else {
      await interaction.deferReply({ ephemeral: true })
      channel = interaction.options.getChannel('channel')
      messageId = interaction.options.getString('message')
      title = interaction.options.getString('title')
      description = interaction.options.getString('description')
    }

    // Validate channel
    if (channel.type !== 'GUILD_TEXT') {
      if (message) return await message.reply('Invalid channel')
      return FailureMessage(interaction, 'Invalid channel')
    }

    // Get message
    const targetMessage = await channel.messages.fetch(messageId, {
      cache: true,
      force: true,
    })

    // Validate message
    if (!targetMessage) {
      if (message) return await message.reply('Invalid messageId')
      return FailureMessage(interaction, 'Invalid messageId')
    }
    if (targetMessage.author.id !== client.user.id) {
      if (message) return await message.reply('Invalid message')
      return FailureMessage(interaction, 'Invalid message')
    }

    // Get user for footer
    const userId = message
      ? guild.members.cache.get(message.author.id).user.id
      : interaction.user.id

    if (!targetMessage.embeds.length) {
      {
        if (message) return await message.reply('Invalid embed')
        return FailureMessage(interaction, 'Invalid embed')
      }
    }

    // Edit message
    const editEmbed = await targetMessage.edit({
      embeds: [
        {
          color: targetMessage.embeds[0].color,
          title: `${title ? title : ''}`,
          description: `${description ? description : ''}`,
          footer: { text: userId },
          timestamp: new Date(),
        },
      ],
    })

    if (!editEmbed) {
      if (message) return await message.reply('Something went wrong')
      return FailureMessage(interaction, 'Something went wrong')
    }

    if (message) {
      const reply = await message.reply('Embed sent')
      await message.delete()
      setTimeout(() => reply.delete(), 3000)
      return
    }
    return SuccessMessage(interaction, 'Embed sent')
  },
} as ICommand
