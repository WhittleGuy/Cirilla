import { GuildMember } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'

export default {
  category: 'Moderation',
  description: 'Kicks a user',
  permissions: ['ADMINISTRATOR'],
  // requireRoles: true,
  slash: true,
  testOnly: true,
  guildOnly: true,
  syntax: '<user> [length] [reason]',
  options: [
    {
      name: 'user',
      description: 'The user you want to kick',
      type: 6,
      required: true,
    },
    {
      name: 'length',
      description:
        'Length of time in seconds to time out the user (defaults to 300)',
      type: 10,
      required: false,
    },
    {
      name: 'reason',
      description: 'Explain why you are kicking this user',
      type: 3,
      required: false,
    },
  ],

  callback: async ({ interaction }) => {
    const member = interaction.options.getMember('user') as GuildMember
    const reason = interaction.options.getString('reason')
    let length = interaction.options.getNumber('length') * 1000
    length < 1 ? (length = 300000) : length
    if (!member) return FailureEmbed(interaction, 'Tag a valid user')

    const timed = await member.timeout(length, reason).catch((err) => {
      return FailureEmbed(interaction, err)
    })
    if (timed)
      SuccessEmbed(
        interaction,
        `${member.user.tag} has been timed out for ${length / 1000}s`
      )
  },
} as ICommand
