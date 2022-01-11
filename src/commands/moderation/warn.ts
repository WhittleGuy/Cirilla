import { ICommand } from 'wokcommands'
import { ColorCheck, FailureMessage, SuccessMessage } from '../../helpers'
import warnSchema from '../../models/warn-schema'

export default {
  category: 'Moderation',
  description: 'Warn a user',
  permissions: ['BAN_MEMBERS'],
  // requireRoles: true,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'add',
      description: 'Add a warning to a user',
      type: 1,
      options: [
        {
          name: 'user',
          description: 'User to warn',
          type: 6,
          required: true,
        },
        {
          name: 'reason',
          description: 'Reason for warning',
          type: 3,
          required: true,
        },
      ],
    },
    // {
    //   name: 'remove',
    //   description: 'Remove a warning from a user',
    //   type: 1,
    //   options: [
    //     {
    //       name: 'user',
    //       description: 'User to warn',
    //       type: 6,
    //       required: true,
    //     },
    //     {
    //       name: 'id',
    //       description: 'WarningId',
    //       type: 3,
    //       required: true,
    //     },
    //   ],
    // },
    {
      name: 'list',
      description: 'List all warnings for a user',
      type: 1,
      options: [
        {
          name: 'user',
          description: 'User to search',
          type: 6,
          required: true,
        },
      ],
    },
  ],

  callback: async ({ guild, member: staff, interaction }) => {
    await interaction.deferReply({ ephemeral: true })
    const subCommand = interaction.options.getSubcommand()
    const user = interaction.options.getUser('user')
    const reason = interaction.options.getString('reason')
    //const id = interaction.options.getString('id')

    if (subCommand === 'add') {
      await interaction.editReply({
        embeds: [
          {
            color: 0x36393f,
            title: `Warn ${user.tag}?`,
            description: `Are you sure you want to warn ${user.tag} for\n> ${reason}?`,
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
                label: `Warn`,
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
            const warning = await warnSchema.create({
              userId: user?.id,
              staffId: staff.id,
              guildId: guild?.id,
              reason,
            })

            if (!warning)
              return FailureMessage(interaction, 'Error adding warning')
            await user.send({
              embeds: [
                {
                  color: 0xff6a00,
                  title: `${interaction.guild.name} | Warning`,
                  description: `Reason: ${reason}`,
                },
              ],
            })

            return SuccessMessage(
              interaction,
              `Added warning ${warning.id} to <@${user?.id}>`
            )
          } else if (button.customId === 'cirilla-cancel') {
            return SuccessMessage(interaction, 'Warning cancelled')
          }
        })
        .catch(() => {
          return FailureMessage(interaction, 'Confirmation timed out')
        })
    }

    // Remove warning
    // else if (subCommand === 'remove') {
    //   // @ts-ignore
    //   const warning = warnSchema.findOneAndDelete(id)
    //   console.log(warning)
    //   if (!warning) FailureEmbed(interaction, 'Error removing warning')
    //   SuccessEmbed(
    //     interaction, // @ts-ignore
    //     `Removed warning ${id} from <@${user?.id}>`
    //   )
    // }

    // List warnings
    else if (subCommand === 'list') {
      const warnings = await warnSchema.find({
        userId: user?.id,
        guildId: guild?.id,
      })

      if (!warnings) FailureMessage(interaction, 'Error fetching user warnings')

      let description = `userId: ${user?.id}\n\n`
      for (const warning of warnings) {
        description += `**Id:** ${warning._id}\n`
        description += `**Date:** ${warning.createdAt.toLocaleString()}\n`
        description += `**Staff:** <@${warning.staffId}>\n`
        description += `**Reason:** ${warning.reason}\n\n`
      }

      await interaction
        .editReply({
          embeds: [
            {
              color: ColorCheck('#ff0000'),
              title: `Warnings for ${user?.tag}`,
              description: description ? description : 'None',
              thumbnail: { url: user.displayAvatarURL() },
            },
          ],
        })
        .catch((err) => console.log(err))
    }
  },
} as ICommand
