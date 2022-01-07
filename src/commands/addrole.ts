import {
  Client,
  GuildMember,
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
} from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'

export default {
  category: 'Moderation',
  description: 'Adds a role dropdown or additional role to existing dropdown',
  permissions: ['MANAGE_ROLES'],
  // requireRoles: true,
  slash: true,
  testOnly: true,
  guildOnly: true,
  options: [
    {
      name: 'channel',
      description: 'Channel the role message is in',
      type: 7,
      required: true,
    },
    {
      name: 'message',
      description: 'ID of the role message',
      type: 3,
      required: true,
    },
    {
      name: 'role',
      description: 'Role to add',
      type: 8,
      required: true,
    },
    {
      name: 'roledesc',
      description: 'Role Description',
      type: 3,
      required: false,
    },
  ],

  init: (client: Client) => {
    client.on('interactionCreate', (interaction) => {
      if (!interaction.isSelectMenu()) {
        return
      }

      const { customId, values, member } = interaction

      if (customId === 'auto-roles-cirilla' && member instanceof GuildMember) {
        const component = interaction.component as MessageSelectMenu
        const removed = component.options.filter((option) => {
          return !values.includes(option.value)
        })

        for (const id of values) {
          member.roles.add(id)
        }

        for (const id of removed) {
          member.roles.remove(id.value)
        }

        SuccessEmbed(interaction, 'Roles updated!')
      }
    })
  },

  callback: async ({ client, interaction }) => {
    await interaction.deferReply({ ephemeral: true })
    const channel = interaction.options.getChannel('channel')
    if (channel.type !== 'GUILD_TEXT')
      return FailureEmbed(interaction, 'Invalid channel')
    const messageId = interaction.options.getString('message')
    const role = interaction.options.getRole('role')
    const description = interaction.options.getString('roledesc')

    const targetMessage = await channel.messages.fetch(messageId, {
      cache: true,
      force: true,
    })

    if (!targetMessage) return FailureEmbed(interaction, 'Invalid message Id')
    if (targetMessage.author.id !== client.user.id)
      return FailureEmbed(
        interaction,
        `Invalid message. Message author must be <@${client.user.id}>.\
         Consider using \`/embed\``
      )

    let row = targetMessage.components[0] as MessageActionRow
    if (!row) {
      row = new MessageActionRow()
    }

    const option: MessageSelectOptionData[] = [
      {
        label: role.name,
        value: role.id,
      },
    ]

    let menu = row.components[0] as MessageSelectMenu
    if (menu) {
      for (const o of menu.options) {
        if (o.value === option[0].value) {
          return FailureEmbed(interaction, `${o.label} is already in this menu`)
        }
      }

      menu.addOptions(option)
      menu.setMaxValues(menu.options.length)
    } else {
      row.addComponents({
        type: 3, // Select Menu
        customId: 'auto-roles-cirilla',
        placeholder: 'Select roles',
        minValues: 0,
        maxValues: 1,
        options: [
          {
            label: role.name,
            value: role.id,
            description: description,
          },
        ],
      })
    }

    await targetMessage.edit({
      components: [row],
    })

    return SuccessEmbed(
      interaction,
      `Added <@&${role.id}> to the auto roles menu`
    )
  },
} as ICommand
