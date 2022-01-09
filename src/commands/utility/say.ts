import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'

export default {
  category: 'Utility',
  description: 'Send a message from Cirilla',
  permissions: ['MANAGE_MESSAGES'],
  requireRoles: false,
  slash: 'both',
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'channel',
      description: 'Message channel',
      type: 7,
      required: true,
    },
    {
      name: 'message',
      description: 'What Cirilla will say',
      type: 3,
      required: true,
    },
  ],

  callback: async ({ guild, message, interaction }) => {
    let channel, content
    // Normal command
    if (message) {
      const idReg = /\d{18}/
      const text = message.content.split(' ').slice(1)
      const channelId = idReg.exec(text[0])[0] || null
      if (channelId === null)
        return await message.reply('Please tag a text channel')
      channel = guild.channels.cache.get(channelId)
      content = text.slice(1).join(' ')
    }
    //Slash command
    else {
      await interaction.deferReply()
      channel = interaction.options.getChannel('channel')
      content = interaction.options.getString('message')
    }

    if (channel.type !== 'GUILD_TEXT') {
      if (message) return 'Please tag a text channel'
      return FailureMessage(interaction, 'Please tag a text channel')
    }

    const sendMessage = await channel.send(content)

    if (!sendMessage) {
      if (message) return 'Error sending message'
      return FailureMessage(interaction)
    }

    if (message) {
      const reply = await message.reply('Message sent')
      await message.delete()
      setTimeout(() => reply.delete(), 3000)
      return
    }
    return SuccessMessage(interaction, 'Message sent')
  },
} as ICommand
