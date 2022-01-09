import { GuildMember } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'

export default {
  category: 'Moderation',
  description: 'Timeout a user',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: true,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'User to timeout',
      type: 6,
      required: true,
    },
    {
      name: 'length',
      description: 'Length of time (minutes) (default: 5)',
      type: 10,
      required: false,
    },
    {
      name: 'reason',
      description: 'Reason for timeout',
      type: 3,
      required: false,
    },
  ],

  callback: async ({ interaction }) => {
    const member = interaction.options.getMember('user') as GuildMember
    const reason = interaction.options.getString('reason')
    let length = interaction.options.getNumber('length') * 1000 * 60
    length < 1 ? (length = 300000) : length
    if (!member) return FailureMessage(interaction, 'Tag a valid user')

    const timed = await member.timeout(length, reason).catch((err) => {
      return FailureMessage(interaction, err)
    })
    if (timed)
      SuccessMessage(
        interaction,
        `${member.user.tag} has been timed out for ${length / 60000}m`
      )
  },
} as ICommand
