import { TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'

export default {
  category: 'Utility',
  description: 'Make Cirilla say stuff',
  permissions: ['ADMINISTRATOR'],
  slash: true,
  testOnly: true,
  guildOnly: true,
  options: [
    {
      name: 'channel',
      description: 'The channel you want to send the message in',
      type: 7,
      required: true,
    },
    {
      name: 'message',
      description: 'What you want the Cirilla to say',
      type: 3,
      required: true,
    },
  ],

  callback: ({ interaction }) => {
    const channel = interaction.options.getChannel('channel') as TextChannel
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
