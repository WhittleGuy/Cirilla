import { GuildMember } from 'discord.js'
import { ICommand } from 'wokcommands'

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

  callback: ({ interaction }) => {
    const member = interaction.options.getMember('user') as GuildMember
    const reason = interaction.options.getString('reason')

    if (!member) {
      const failureEmbed = {
        color: 0xff0000,
        description: 'Please tag the user to ban',
      }
      return interaction.reply({ embeds: [failureEmbed], ephemeral: true })
    }

    if (!member.bannable) {
      const failureEmbed = {
        color: 0xff0000,
        description: 'Cannot ban that user',
      }
      return interaction.reply({ embeds: [failureEmbed], ephemeral: true })
    }

    member
      .ban({
        reason,
        days: 7,
      })
      .then(() => {
        const successEmbed = {
          color: 0x00ff00,
          description: `${member.user.tag} has been banned`,
        }
        return interaction.reply({ embeds: [successEmbed], ephemeral: true })
      })
      .catch((err) => {
        const failureEmbed = {
          color: 0xff0000,
          description: `Something went wrong:\n${err}`,
        }
        return interaction.reply({ embeds: [failureEmbed], ephemeral: true })
      })
  },
} as ICommand
