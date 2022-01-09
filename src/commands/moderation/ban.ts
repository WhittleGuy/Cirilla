import { GuildMember } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'

export default {
  category: 'Moderation',
  description: 'Ban a user',
  permissions: ['BAN_MEMBERS'],
  // requireRoles: true,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'User to ban',
      type: 6,
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for ban',
      type: 3,
      required: false,
    },
  ],

  callback: async ({ interaction }) => {
    const member = interaction.options.getMember('user') as GuildMember
    const reason = interaction.options.getString('reason')

    if (!member) {
      return FailureMessage(interaction, 'Tag a valid user')
    }

    if (!member.bannable) {
      return FailureMessage(interaction, 'Cannot ban that user')
    }

    member
      .ban({
        reason,
        days: 7,
      })
      .then(() => {
        return SuccessMessage(interaction, `${member.user.tag} has been banned`)
      })
      .catch((err) => {
        return FailureMessage(interaction, err)
      })
  },
} as ICommand
