import { ICommand } from 'wokcommands'
import { FailureMessage, SendError, SuccessMessage } from '../../helpers'

export default {
  category: 'Utility',
  description: 'Send a message from Cirilla',
  permissions: ['MANAGE_MESSAGES'],
  requireRoles: false,
  slash: true,
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

  callback: async ({ guild, message, interaction, member }) => {
    let channel, content

    // Normal command
    if (message) {
      const idReg = /\d{18}/
      const text = message.content.split(' ').slice(1)
      const channelId = idReg.exec(text[0])[0] || null
      if (channelId === null)
        return FailureMessage(message, 'Tag a text channel')
      channel = guild.channels.cache.get(channelId)
      content = text.slice(1).join(' ')
    }

    //Slash command
    else {
      await interaction.deferReply({ ephemeral: true })
      channel = interaction.options.getChannel('channel')
      content = interaction.options.getString('message')
    }

    if (channel.type !== 'GUILD_TEXT') {
      return FailureMessage(message || interaction, 'Please tag a text channel')
    }

    const chunkRegEx = /(.|\n){1,2000}(\s|$)/g
    let chunks = content.match(chunkRegEx)

    for (let i = 0; i < chunks.length; i++) {
      try {
        await channel.send(chunks[i])
      } catch (err) {
        SendError('say.ts', guild, member, err)
        return FailureMessage(message || interaction)
      }
    }

    return SuccessMessage(message || interaction)
  },
} as ICommand
