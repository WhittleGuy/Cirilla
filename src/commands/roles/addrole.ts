import {
  Client,
  GuildMember,
  MessageActionRow,
  MessageSelectMenu,
  Role,
} from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'

interface RoleOption {
  label: string
  value: string
  description: string
  emoji: string
}

export default {
  category: 'CirillaRoles',
  description:
    'Add a role dropdown to a Cirilla embed or message | Add a new role to existing',
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
      name: 'role_1',
      description: 'Role',
      type: 8,
      required: true,
    },
    {
      name: 'description_1',
      description: 'Role Description',
      type: 3,
      required: false,
    },
    {
      name: 'emote_1',
      description: 'Role panel emote',
      type: 3,
      required: false,
    },
    {
      name: 'role_2',
      description: 'Role',
      type: 8,
      required: false,
    },
    {
      name: 'description_2',
      description: 'Role Description',
      type: 3,
      required: false,
    },
    {
      name: 'emote_2',
      description: 'Role panel emote',
      type: 3,
      required: false,
    },
    {
      name: 'role_3',
      description: 'Role',
      type: 8,
      required: false,
    },
    {
      name: 'description_3',
      description: 'Role Description',
      type: 3,
      required: false,
    },
    {
      name: 'emote_3',
      description: 'Role panel emote',
      type: 3,
      required: false,
    },
    {
      name: 'role_4',
      description: 'Role',
      type: 8,
      required: false,
    },
    {
      name: 'description_4',
      description: 'Role Description',
      type: 3,
      required: false,
    },
    {
      name: 'emote_4',
      description: 'Role panel emote',
      type: 3,
      required: false,
    },
    {
      name: 'role_5',
      description: 'Role',
      type: 8,
      required: false,
    },
    {
      name: 'description_5',
      description: 'Role Description',
      type: 3,
      required: false,
    },
    {
      name: 'emote_5',
      description: 'Role panel emote',
      type: 3,
      required: false,
    },
    {
      name: 'exclusive',
      description:
        'Roles are exclusive from eachother. Set on creation. (Default: false)',
      type: 5,
      required: false,
    },
  ],

  // Listen for menu use and add/remove roles
  init: (client: Client) => {
    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isSelectMenu()) return

      const { customId, values, member } = interaction
      if (
        ['cirilla-roles', 'cirilla-roles-exclusive'].includes(customId) &&
        member instanceof GuildMember
      ) {
        await interaction.deferReply({ ephemeral: true })
        const component = interaction.component as MessageSelectMenu
        const removed = component.options.filter((option) => {
          return !values.includes(option.value)
        })

        for (const id of values) {
          await member.roles
            .add(id)
            .catch((err) => console.log(`Role Add Error: ${err}`))
        }

        for (const id of removed) {
          await member.roles
            .remove(id.value)
            .catch((err) => console.log(`Role Remove Error: ${err}`))
        }

        SuccessMessage(interaction, 'Roles updated!')
      }
    })
  },

  // Add/Remove roles from message
  callback: async ({ client, interaction }) => {
    // Send "thinking" response
    await interaction.deferReply({ ephemeral: true })

    // Get channel and validate
    const channel = interaction.options.getChannel('channel')
    if (channel.type !== 'GUILD_TEXT')
      return FailureMessage(interaction, 'Invalid channel')

    // Get message
    const messageId = interaction.options.getString('message')
    const targetMessage = await channel.messages.fetch(messageId, {
      cache: true,
      force: true,
    })
    // Validate message exists and was written by the bot
    if (!targetMessage) return FailureMessage(interaction, 'Invalid message Id')
    if (targetMessage.author.id !== client.user.id) {
      return FailureMessage(
        interaction,
        `Invalid message. Message author must be <@${client.user.id}>.\
         Try using \`/embed\` or \`/say\``
      )
    }

    // Get exclusivity
    const exclusive = interaction.options.getBoolean('exclusive') || false

    // Get all role data
    let roleOptionArray: RoleOption[] = []

    for (let i = 0; i < 5; i++) {
      const role = interaction.options.getRole(`role_${i + 1}`) as Role
      const description = interaction.options.getString(`description_${i + 1}`)
      const emote = interaction.options.getString(`emote_${i + 1}`)

      // Only add supplied roles, and no duplicates
      if (role?.id && !roleOptionArray.map((o) => o.value).includes(role.id)) {
        roleOptionArray.push({
          label: role.name,
          value: role.id,
          description: description,
          emoji: emote,
        })
      }
    }

    // Get or create ActionRow if not present
    let row = targetMessage.components[0] as MessageActionRow
    if (!row) row = new MessageActionRow()

    let menu = row.components[0] as MessageSelectMenu
    if (menu) {
      for (const o of menu.options) {
        roleOptionArray = roleOptionArray.filter((opt) => opt.value !== o.value)
      }

      menu.addOptions(roleOptionArray)
      menu.setMaxValues(
        menu.customId === 'cirilla-roles-exclusive' ? 1 : menu.options.length
      )
    } else {
      row.addComponents({
        type: 3, // Select Menu
        customId: exclusive ? 'cirilla-roles-exclusive' : 'cirilla-roles',
        placeholder: 'Select roles',
        minValues: 0,
        maxValues: exclusive ? 1 : roleOptionArray.length,
        options: roleOptionArray,
      })
    }

    await targetMessage.edit({
      components: [row],
    })

    interaction.editReply(
      `Added [${roleOptionArray.map((o) => o.label).join()}] to ${
        targetMessage.id
      }`
    )
  },
} as ICommand
