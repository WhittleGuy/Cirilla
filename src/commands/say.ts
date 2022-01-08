import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'

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

  callback: ({ interaction }) => {
    const channel = interaction.options.getChannel('channel')
    if (channel.type !== 'GUILD_TEXT')
      return FailureEmbed(interaction, 'Please tag a text channel')
    const message = interaction.options.getString('message')

    const sendMessage = async (channel, msg) => {
      await channel.send(msg)
    }

    if (!sendMessage(channel, message)) {
      return FailureEmbed(interaction)
    }
    return SuccessEmbed(
      interaction,
      `Message sent in ${channel.toString()}\n\`\`\`${message}\n\`\`\``
    )
  },
} as ICommand
