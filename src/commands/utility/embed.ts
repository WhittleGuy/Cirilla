import { ColorResolvable } from 'discord.js'
import { ICommand } from 'wokcommands'
import { ColorCheck, FailureMessage, SuccessMessage } from '../../helpers'

export default {
  category: 'Utility',
  description: 'Post a custom embed',
  permissions: ['MANAGE_MESSAGES'],
  requireRoles: false,
  slash: 'both',
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'channel',
      type: 7,
      description: 'Embed channel',
      required: true,
    },
    {
      name: 'title',
      description: 'Embed title',
      type: 3,
      required: true,
    },
    {
      name: 'description',
      description: 'Embed description',
      type: 3,
      required: false,
    },
    {
      name: 'color',
      description: 'Embed color (#ff9ed7)',
      type: 3,
      required: false,
    },
  ],

  callback: async ({ guild, message, interaction }) => {
    let channel, title, description, color
    // Standard command
    if (message) {
      const idReg = /\d{18}/
      let text = message.content.split(' ').slice(1)
      const channelId = idReg.exec(text[0])[0] || null
      if (channelId === null)
        return FailureMessage(message, 'Tag a text channel')
      channel = guild.channels.cache.get(channelId)
      text.shift()
      text = text.join(' ').split('|')
      title = text[0]
      description = text.slice(1)
    }
    //Slash command
    else {
      channel = interaction.options.getChannel('channel')
      title = interaction.options.getString('title')
      description = interaction.options.getString('description')
      color = interaction.options.getString('color') as ColorResolvable
    }

    if (channel.type !== 'GUILD_TEXT') {
      return FailureMessage(message || interaction, 'Invalid channel')
    }

    const userId = message
      ? guild.members.cache.get(message.author.id).user.id
      : interaction.user.id

    const postEmbed = await channel.send({
      embeds: [
        {
          color: ColorCheck(color),
          title: `${title ? title : ''}`,
          description: `${description ? description : ''}`,
          footer: { text: userId },
          timestamp: new Date(),
        },
      ],
    })

    if (!postEmbed) {
      return FailureMessage(message || interaction)
    }

    return SuccessMessage(message || interaction, 'Embed sent')
  },
} as ICommand
