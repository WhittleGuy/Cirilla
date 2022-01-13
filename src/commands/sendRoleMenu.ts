import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'

export default {
  category: 'Moderation',
  description: 'Bans a user',
  permissions: ['MANAGE_ROLES'],
  // requireRoles: true,
  slash: true,
  testOnly: true,
  guildOnly: true,
  options: [
    {
      name: 'channel',
      description: 'The channel to send the dropdown to',
      type: 7,
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
      required: true,
    },
  ],

  callback: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: true })
    const channel = interaction.options.getChannel('channel')
    const title = interaction.options.getString('title')
    const description = interaction.options.getString('description')
    if (channel.type !== 'GUILD_TEXT') {
      return FailureEmbed(interaction, 'Tag a valid text channel')
    }

    await channel.send({
      embeds: [
        {
          color: 0xff9ed7,
          title: title ? title : null,
          description: description,
        },
      ],
    })
    return SuccessEmbed(interaction, 'Dropdown menu posted')
  },
} as ICommand
