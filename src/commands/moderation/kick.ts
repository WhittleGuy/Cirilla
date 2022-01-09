import { GuildMember } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'

export default {
  category: 'Moderation',
  description: 'Kick a user',
  permissions: ['KICK_MEMBERS'],
  // requireRoles: true,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'User to kick',
      type: 6,
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for kick',
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

    if (!member.kickable) {
      return FailureMessage(interaction, 'Cannot kick that user')
    }

    const kicked = await member.kick(reason).catch((err) => {
      return FailureMessage(interaction, err)
    })
    if (kicked)
      SuccessMessage(interaction, `${member.user.tag} has been kicked`)
  },
} as ICommand
