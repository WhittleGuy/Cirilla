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

    if (!reason) return FailureMessage(interaction, 'Provide a reason')

    await member.send({
      embeds: [
        {
          color: 0xff0000,
          title: `Banned from ${interaction.guild.name}`,
          description: `**Reason**:\n${reason}`,
        },
      ],
    })

    await member.ban({ reason, days: 7 }).catch((err) => {
      return FailureMessage(interaction, err)
    })
    return SuccessMessage(interaction, `${member.user.tag} has been banned`)
  },
} as ICommand
