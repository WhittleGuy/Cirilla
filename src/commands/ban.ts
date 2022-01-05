import { GuildMember } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureEmbed } from '../helpers/FailureEmbed'

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
        return interaction.reply({
          embeds: [
            {
              color: 0x00ff00,
              description: `${member.user.tag} has been banned`,
            },
          ],
          ephemeral: true,
        })
      })
      .catch((err) => {
        return FailureEmbed(interaction, err)
      })
  },
} as ICommand
