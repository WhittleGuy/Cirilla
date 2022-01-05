import { TextChannel } from 'discord.js'
import { execPath } from 'process'
import { ICommand } from 'wokcommands'

export default {
  category: 'Utility',
  description: 'Make Cirilla say stuff',
  permissions: ['ADMINISTRATOR'],
  // requireRoles: true,
  slash: true,
  testOnly: true,
  guildOnly: true,
  syntax: '<channel> <title> <description>',
  options: [
    {
      name: 'channel',
      description: 'The channel you want to send the message in',
      type: 7,
      required: true,
    },
    {
      name: 'message',
      description: 'What you want the message to say',
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

    if (sendMessage(channel, message)) {
      interaction.reply({
        embeds: [
          {
            color: 0x00ff00,
            description: `Message sent in ${channel.toString()}\n\`\`\`${message}\n\`\`\``,
          },
        ],
        ephemeral: true,
      })
    } else {
      interaction.reply({
        embeds: [
          {
            color: 0xff0000,
            description: `Something went wrong`,
          },
        ],
        ephemeral: true,
      })
    }
  },
} as ICommand
