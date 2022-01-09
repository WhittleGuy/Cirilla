import { ICommand } from 'wokcommands'
import { ColorCheck, FailureEmbed, SuccessEmbed } from '../../helpers'
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

    // Add warning
    if (subCommand === 'add') {
      const warning = await warnSchema.create({
        userId: user?.id,
        staffId: staff.id,
        guildId: guild?.id,
        reason,
      })

      if (!warning) FailureEmbed(interaction, 'Error adding warning')
      SuccessEmbed(interaction, `Added warning ${warning.id} to <@${user?.id}>`) // @ts-ignore
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

      if (!warnings) FailureEmbed(interaction, 'Error fetching user warnings')

      let description = ''
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
              title: `Warnings for <@${user?.id}>`,
              description: description ? description : 'None',
            },
          ],
        })
        .catch((err) => console.log(err))
    }
  },
} as ICommand
