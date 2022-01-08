import { ColorResolvable } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'
import { ColorCheck } from '../helpers/ColorCheck'

export default {
  category: 'Utility',
  description: 'Post a custom embed',
  permissions: ['MANAGE_MESSAGES'],
  requireRoles: false,
  slash: true,
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

  callback: async ({ interaction }) => {
    const channel = interaction.options.getChannel('channel')
    if (channel.type !== 'GUILD_TEXT')
      return FailureEmbed(interaction, 'Please tag a text channel')
    const title = interaction.options.getString('title')
    const description = interaction.options.getString('description')
    const color = interaction.options.getString('color') as ColorResolvable

    const postEmbed = await channel
      .send({
        embeds: [
          {
            color: ColorCheck(color),
            title: title,
            description: `${description ? description : ''}`,
          },
        ],
      })
      .catch((err) => {
        return FailureEmbed(interaction, err)
      })

    if (postEmbed) {
      return SuccessEmbed(interaction, `Embed posted in <#${channel.id}>`)
    }
  },
} as ICommand
