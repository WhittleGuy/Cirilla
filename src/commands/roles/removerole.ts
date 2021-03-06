import {
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
} from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureMessage, SendError, SuccessMessage } from '../../helpers'

export default {
  category: 'CirillaRoles',
  description: 'Remove role from CirillaRoles dropdown',
  permissions: ['MANAGE_ROLES'],
  // requireRoles: true,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'channel',
      description: 'Message channel',
      type: 7,
      required: true,
    },
    {
      name: 'message',
      description: 'MessageId',
      type: 3,
      required: true,
    },
    {
      name: 'role',
      description: 'Role',
      type: 8,
      required: true,
    },
  ],

  callback: async ({ interaction, guild, member }) => {
    await interaction.deferReply({ ephemeral: true })
    const channel = interaction.options.getChannel('channel')
    if (channel.type !== 'GUILD_TEXT')
      return FailureMessage(interaction, 'Invalid channel')
    const messageId = interaction.options.getString('message')
    const role = interaction.options.getRole('role')

    const targetMessage = await channel.messages.fetch(messageId, {
      cache: true,
      force: true,
    })
    if (!targetMessage) return FailureMessage(interaction, 'Invalid message Id')

    let row = targetMessage.components[0] as MessageActionRow
    if (!row) {
      return FailureMessage(interaction, 'Invalid message.')
    }

    const menu = row.components[0] as MessageSelectMenu
    if (menu) {
      if (
        !['cirilla-roles', 'cirilla-roles-exclusive'].includes(menu.customId)
      ) {
        return FailureMessage(interaction, 'Invalid message.')
      } else if (!menu.options.map((o) => o.value).includes(role.id))
        return FailureMessage(interaction, `[${role.name}] not in that menu`)

      const newOpts = menu.options.filter(
        (o) => o.value !== role.id
      ) as MessageSelectOptionData[]

      try {
        if (menu.options.length === 1) {
          await targetMessage.edit({ components: [] })
        } else {
          await targetMessage.edit({
            components: [
              row.setComponents(
                menu.setOptions(newOpts).setMaxValues(menu.options.length)
              ),
            ],
          })
        }
      } catch (err) {
        SendError('removerole.ts', guild, member, err)
      }

      return SuccessMessage(
        interaction,
        `[${role.name}] removed from ${targetMessage.id}`
      )
    }
  },
} as ICommand
