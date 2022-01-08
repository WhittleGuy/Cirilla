import { User } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureEmbed } from '../helpers'
import { ColorCheck } from '../helpers/ColorCheck'

export default {
  category: 'Information',
  description: 'Search a userId',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: false,
  options: [
    {
      name: 'id',
      description: 'UserId',
      type: 3,
      required: true,
    },
  ],

  callback: async ({ client, interaction }) => {
    await interaction.deferReply()
    const userId = interaction.options.getString('id')
    const user: User | void = await client.users.fetch(userId).catch(() => {
      FailureEmbed(interaction, 'Invalid userId')
    })
    if (user) {
      interaction.editReply({
        embeds: [
          {
            color: ColorCheck(),
            title: user.tag,
            thumbnail: { url: user.displayAvatarURL() },
            footer: { text: `ID: ${user.id}` },
            fields: [
              {
                name: 'Bot',
                value: user.bot ? 'Yes' : 'No',
                inline: true,
              },
              {
                name: 'Flags',
                value: user.flags
                  ? user.flags
                      .toArray()
                      .map((flag) => flag.split('_').join(' '))
                      .join('\n') || 'None'
                  : 'None',
                inline: true,
              },
              {
                name: 'Joined Discord',
                value:
                  new Date(user.createdTimestamp).toLocaleDateString() +
                  '\n' +
                  new Date(user.createdTimestamp).toLocaleTimeString(),
                inline: true,
              },
            ],
          },
        ],
      })
    }
  },
} as ICommand
