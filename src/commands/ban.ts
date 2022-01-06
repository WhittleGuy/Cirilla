import { GuildMember } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'

export default {
  category: 'Moderation',
  description: 'Bans a user',
  permissions: ['BAN_MEMBERS'],
  // requireRoles: true,
  slash: true,
  testOnly: true,
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'The user you want to ban',
      type: 6,
      required: true,
    },
    {
      name: 'reason',
      description: 'Explain why you are banning this user',
      type: 3,
      required: false,
    },
  ],

  callback: async ({ interaction }) => {
    const member = interaction.options.getMember('user') as GuildMember
    const reason = interaction.options.getString('reason')

    if (!member) {
      return FailureEmbed(interaction, 'Tag a valid user')
    }

    if (!member.bannable) {
      return FailureEmbed(interaction, 'Cannot ban that user')
    }

    member
      .ban({
        reason,
        days: 7,
      })
      .then(() => {
        return SuccessEmbed(interaction, `${member.user.tag} has been banned`)
      })
      .catch((err) => {
        return FailureEmbed(interaction, err)
      })
  },
} as ICommand
