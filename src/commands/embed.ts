import { TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
  category: 'Utility',
  description: 'Sends a custom embed to a tagged channel',
  permissions: ['ADMINISTRATOR'],
  // requireRoles: true,
  slash: true,
  testOnly: true,
  guildOnly: true,
  syntax: '<channel> <title> <description>',
  options: [
    {
      name: 'channel',
      type: 7,
      description: 'The channel to post the embed to',
      required: true,
    },
    {
      name: 'title',
      description: 'The title of the embed',
      type: 3,
      required: true,
    },
    {
      name: 'description',
      description: 'The description for the embed',
      type: 3,
      required: true,
    },
  ],

  callback: ({ interaction }) => {
    const channel = interaction.options.getChannel('channel') as TextChannel
    const title = interaction.options.getString('title')
    const description = interaction.options.getString('description')

    const embed = {
      color: 0xff9ed7,
      title: title,
      description: description,
    }

    channel.send({ embeds: [embed] })
    interaction.reply({
      content: 'Embed posted',
    })
    setTimeout(() => interaction.deleteReply(), 3000)
  },
} as ICommand
