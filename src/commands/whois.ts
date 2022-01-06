import { User } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureEmbed } from '../helpers'

export default {
  category: 'Moderation',
  description: 'Bans a user',
  permissions: ['ADMINISTRATOR'],
  // requireRoles: true,
  slash: true,
  testOnly: true,
  guildOnly: true,
  syntax: '<user> [reason]',
  options: [
    {
      name: 'id',
      description: 'The userId you want to lookup',
      type: 3,
      required: true,
    },
  ],

  callback: async ({ client, interaction }) => {
    await interaction.deferReply()
    const userId = interaction.options.getString('id')
    const user: User | void = await client.users.fetch(userId).catch((err) => {
      FailureEmbed(interaction, err)
    })
    if (user) {
      interaction.editReply({
        embeds: [
          {
            color: 0xffee8f,
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
                value:
                  user.flags
                    .toArray()
                    .map((flag) => flag.split('_').join(' '))
                    .join('\n') || 'None',
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
