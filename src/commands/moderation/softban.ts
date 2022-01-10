import { GuildMember } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'

export default {
  category: 'Moderation',
  description: 'Softban a user',
  permissions: ['BAN_MEMBERS'],
  // requireRoles: true,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'User to softban',
      type: 6,
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for softban',
      type: 3,
      required: false,
    },
  ],

  callback: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: true })
    const member = interaction.options.getMember('user') as GuildMember
    const reason = interaction.options.getString('reason')

    if (!member) {
      return FailureMessage(interaction, 'Tag a valid user')
    }

    if (!member.bannable) {
      return FailureMessage(interaction, 'Cannot ban that user')
    }

    if (!reason) return FailureMessage(interaction, 'Provide a reason')

    member.send({
      embeds: [
        {
          color: 0xff0000,
          title: `Softbanned from ${interaction.guild.name}`,
          description: `**Reason**:\n${reason}`,
        },
      ],
    })
    const bannedMember = (await member.ban({ reason, days: 7 }).catch(() => {
      return FailureMessage(interaction, 'Error banning member')
    })) as GuildMember
    await interaction.guild.bans.remove(bannedMember.id).catch(() => {
      return FailureMessage(interaction, 'Error unbanning member')
    })
    return SuccessMessage(
      interaction,
      `${member.user.username} has been softbanned`
    )
  },
} as ICommand
