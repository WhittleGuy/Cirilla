import { GuildMember } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureEmbed } from '../helpers/FailureEmbed'

export default {
  category: 'Moderation',
  description: 'Kicks a user',
  permissions: ['ADMINISTRATOR'],
  // requireRoles: true,
  slash: true,
  testOnly: true,
  guildOnly: true,
  syntax: '<user> [reason]',
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

  callback: ({ interaction }) => {
    const member = interaction.options.getMember('user') as GuildMember
    const reason = interaction.options.getString('reason')

    if (!member) {
      return FailureEmbed(interaction, 'Tag a valid user')
    }

    if (!member.kickable) {
      return FailureEmbed(interaction, 'Cannot kick that user')
    }

    member
      .kick(reason)
      .then(() => {
        const successEmbed = {
          color: 0x00ff00,
          description: `${member.user.tag} has been kicked`,
        }
        return interaction.reply({ embeds: [successEmbed], ephemeral: true })
      })
      .catch((err) => {
        return FailureEmbed(interaction, err)
      })
  },
} as ICommand
