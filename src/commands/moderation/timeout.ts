import { GuildMember } from 'discord.js'
import { ICommand } from 'wokcommands'
import { ColorCheck, FailureMessage, SuccessMessage } from '../../helpers'

export default {
  category: 'Moderation',
  description: 'Timeout a user',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: true,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'User to timeout',
      type: 6,
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for timeout',
      type: 3,
      required: true,
    },
    {
      name: 'length',
      description: 'Length of time (minutes) (default: 5)',
      type: 10,
      required: false,
    },
  ],

  callback: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: true })
    const member = interaction.options.getMember('user') as GuildMember
    const reason = interaction.options.getString('reason')
    let length = interaction.options.getNumber('length') * 1000 * 60
    length < 1 ? (length = 300000) : length
    if (!member) return FailureMessage(interaction, 'Tag a valid user')

    if (!reason) return FailureMessage(interaction, 'Provide a reason')

    await interaction.editReply({
      embeds: [
        {
          color: ColorCheck('NONE'),
          title: `Timeout ${member.user.tag}?`,
          description: `Are you sure you want to timeout ${
            member.user.tag
          } for ${length / 60000} minutes?`,
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
              label: `Timeout for ${length / 60000}m`,
              style: 4,
              customId: 'cirilla-confirm',
            },
          ],
        },
      ],
    })

    const filter = (i) => {
      i.deferUpdate()
      return i.member.user.id === interaction.member.user.id
    }

    await interaction.channel
      .awaitMessageComponent({ filter, componentType: 'BUTTON', time: 30000 })
      .then(async (button) => {
        if (button.customId === 'cirilla-confirm') {
          await member
            .send({
              embeds: [
                {
                  color: ColorCheck('REMOVE'),
                  title: `${interaction.guild.name} | Timed Out`,
                  description: `**Length**: ${
                    length / 60000
                  } minutes\n**Reason**: ${reason}`,
                },
              ],
            })
            .catch((err) => console.log(err))

          const timed = await member.timeout(length, reason).catch((err) => {
            return FailureMessage(interaction, err)
          })
          if (timed)
            SuccessMessage(
              interaction,
              `${member.user.tag} has been timed out for ${length / 60000}m`
            )
        } else if (button.customId === 'cirilla-cancel') {
          return SuccessMessage(interaction, 'Timeout cancelled')
        }
      })
      .catch(() => {
        return FailureMessage(interaction, 'Confirmation timed out')
      })
  },
} as ICommand
