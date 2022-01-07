import { GuildMember } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'

export default {
  category: 'Moderation',
  description: 'Kicks a user',
  permissions: ['KICK_MEMBERS'],
  // requireRoles: true,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'The user you want to kick',
      type: 6,
      required: true,
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

    if (!member) {
      return FailureEmbed(interaction, 'Tag a valid user')
    }

    if (!member.kickable) {
      return FailureEmbed(interaction, 'Cannot kick that user')
    }

    const kicked = await member.kick(reason).catch((err) => {
      return FailureEmbed(interaction, err)
    })
    if (kicked) SuccessEmbed(interaction, `${member.user.tag} has been kicked`)
  },
} as ICommand
