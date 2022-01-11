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
      required: true,
    },
  ],

  callback: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: true })
    const member = interaction.options.getMember('user') as GuildMember
    const reason = interaction.options.getString('reason')

    if (!member) {
      return FailureMessage(interaction, 'Tag a valid user')
    }

    if (!member.kickable) {
      return FailureMessage(interaction, 'Cannot kick that user')
    }

    await interaction.editReply({
      embeds: [
        {
          color: 0x36393f,
          title: `Kick ${member.user.tag}?`,
          description: `Are you sure you want to kick ${member.user.tag}?`,
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
              label: 'Kick',
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
          await member.send({
            embeds: [
              {
                color: 0xff0000,
                title: `${interaction.guild.name} | Kicked`,
                description: `Reason: ${reason}`,
              },
            ],
          })

          const kicked = await member.kick(reason).catch((err) => {
            return FailureMessage(interaction, err)
          })
          if (kicked)
            SuccessMessage(interaction, `${member.user.tag} has been kicked`)
        } else if (button.customId === 'cirilla-cancel') {
          return SuccessMessage(interaction, 'Kick cancelled')
        }
      })
      .catch(() => {
        return FailureMessage(interaction, 'Confirmation timed out')
      })
  },
} as ICommand
