import { GuildMember } from 'discord.js'
import { ICommand } from 'wokcommands'
import {
  ColorCheck,
  FailureMessage,
  SendError,
  SuccessMessage,
} from '../../helpers'

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
      required: true,
    },
  ],

  callback: async ({ guild, member, interaction }) => {
    await interaction.deferReply({ ephemeral: true })
    const user = interaction.options.getMember('user') as GuildMember
    const reason = interaction.options.getString('reason')

    if (!user) {
      return FailureMessage(interaction, 'Tag a valid user')
    }

    if (!user.bannable) {
      return FailureMessage(interaction, 'Cannot ban that user')
    }

    if (!reason) return FailureMessage(interaction, 'Provide a reason')

    try {
      await interaction.editReply({
        embeds: [
          {
            color: ColorCheck('NONE'),
            title: `Ban ${user.user.tag}?`,
            description: `Are you sure you want to ban ${user.user.tag}?`,
          },
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: 'Cancel',
                style: 2,
                customId: 'cirilla-cancel',
              },
              {
                type: 2,
                label: 'Ban',
                style: 4,
                customId: 'cirilla-confirm',
              },
            ],
          },
        ],
      })
    } catch (err) {
      SendError('ban.ts', guild, member, err)
    }

    const filter = (i) => {
      i.deferUpdate()
      return i.member.user.id === interaction.member.user.id
    }

    try {
      await interaction.channel
        .awaitMessageComponent({ filter, componentType: 'BUTTON', time: 30000 })
        .then(async (button) => {
          if (button.customId === 'cirilla-confirm') {
            await user.send({
              embeds: [
                {
                  color: ColorCheck('REMOVE'),
                  title: `${interaction.guild.name} | Banned`,
                  description: `**Reason**: ${reason}`,
                },
              ],
            })

            await user.ban({ reason, days: 7 })
            return SuccessMessage(
              interaction,
              `${user.user.tag} has been banned`
            )
          } else if (button.customId === 'cirilla-cancel') {
            return SuccessMessage(interaction, 'Ban cancelled')
          }
        })
        .catch(() => {
          return FailureMessage(interaction, 'Confirmation timed out')
        })
    } catch (err) {
      SendError('ban.ts', guild, member, err)
    }
  },
} as ICommand
