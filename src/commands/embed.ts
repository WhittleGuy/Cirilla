import { TextChannel, ColorResolvable } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'
import { ResolveColor } from '../helpers/ResolveColor'

export default {
  category: 'Utility',
  description: 'Sends a custom embed to a tagged channel',
  permissions: ['MANAGE_MESSAGES'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,
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
      required: false,
    },
    {
      name: 'color',
      description: 'The color of the embed',
      type: 3,
      required: false,
    },
  ],

  callback: async ({ interaction }) => {
    const channel = interaction.options.getChannel('channel') as TextChannel
    const title = interaction.options.getString('title')
    const description = interaction.options.getString('description')
    let color: string | boolean = interaction.options.getString('color')
    console.log(color)

    if (color) {
      color = ResolveColor(color)
      if (!color) {
        return FailureEmbed(
          interaction,
          'Invalid color. See tinyurl.com/disccolor'
        )
      }
    }

    const postEmbed = await channel
      .send({
        embeds: [
          {
            // @ts-ignore
            color: color || '#fac0ca',
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
