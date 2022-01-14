import { User } from 'discord.js'
import { ICommand } from 'wokcommands'
import { ColorCheck, FailureMessage, SuccessMessage } from '../../helpers'

export default {
  category: 'Moderation',
  description: 'Unban a user',
  permissions: ['BAN_MEMBERS'],
  // requireRoles: true,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'User to unban',
      type: 6,
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for unban',
      type: 3,
      required: true,
    },
  ],

  callback: async ({ guild, interaction }) => {
    const user = interaction.options.getUser('user') as User
    const reason = interaction.options.getString('reason')

    if (!user) {
      return FailureMessage(interaction, 'Tag a valid user')
    }

    await interaction.reply({
      embeds: [
        {
          color: ColorCheck('NONE'),
          title: `Unban ${user.tag}?`,
          description: `Are you sure you want to unban ${user.tag}?`,
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: 'Cancel',
              style: 4,
              customId: 'cirilla-cancel',
            },
            {
              type: 2,
              label: 'Revoke Ban',
              style: 3,
              customId: 'cirilla-confirm',
            },
          ],
        },
      ],
      ephemeral: true,
    })

    const filter = (i) => {
      i.deferUpdate()
      return i.member.user.id === interaction.member.user.id
    }

    await interaction.channel
      .awaitMessageComponent({ filter, componentType: 'BUTTON', time: 30000 })
      .then(async (button) => {
        if (button.customId === 'cirilla-confirm') {
          await user
            .send({
              embeds: [
                {
                  color: ColorCheck('STATUS'),
                  title: `${interaction.guild.name} | Unbanned`,
                  description: `Reason: ${reason}`,
                },
              ],
            })
            .catch((err) => console.log(err))

          await guild.bans.remove(user.id).catch((err) => {
            return FailureMessage(interaction, err)
          })
          return SuccessMessage(interaction, `${user.tag} has been unbanned`)
        } else if (button.customId === 'cirilla-cancel') {
          return SuccessMessage(interaction, 'Unban cancelled')
        }
      })
      .catch(() => {
        return FailureMessage(interaction, 'Confirmation timed out')
      })
  },
} as ICommand
