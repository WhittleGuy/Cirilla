import {
  Client,
  GuildMember,
  MessageActionRow,
  MessageSelectMenu,
} from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../../helpers'

export default {
  category: 'Moderation',
  description:
    'Add a two-option dropdown to either give a role or (optionally) kick the user.',
  permissions: ['MANAGE_ROLES', 'KICK_MEMBERS'],
  // requireRoles: true,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'channel',
      description: 'Channel to post the menu in',
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
      description: 'Role to give user if they agree',
      type: 8,
      required: true,
    },
    {
      name: 'kick',
      description: 'Kick the user on disagree',
      type: 5,
      required: true,
    },
    {
      name: 'agree_title',
      description: 'Optional title for agree option (Default: Agree)',
      type: 3,
      required: false,
    },
    {
      name: 'disagree_title',
      description: 'Optional title for disagree option (Default: Disagree)',
      type: 3,
      required: false,
    },
    {
      name: 'agree_desc',
      description: 'Optional description for the agree option (Default: None)',
      type: 3,
      required: false,
    },
    {
      name: 'disagree_desc',
      description:
        'Optional description for the disagree option (Default: None)',
      type: 3,
      required: false,
    },
    {
      name: 'agree_emote',
      description: 'Emote for the agree option (Default: None)',
      type: 3,
      required: false,
    },
    {
      name: 'disagree_emote',
      description: 'Emote for the disagree option (Default: None)',
      type: 3,
      required: false,
    },
  ],

  // Listen to dropdown
  init: (client: Client) => {
    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isSelectMenu()) return

      const { customId, values, member } = interaction
      if (customId === 'cirilla-rules-menu' && member instanceof GuildMember) {
        const component = interaction.component as MessageSelectMenu
        const removed = component.options.filter((option) => {
          return !values.includes(option.value)
        })
        if (values.includes('kick')) {
          for (const id of removed) {
            await member.roles.remove(id.value).catch((err) => {
              console.log(`Role Remove Error: ${err}`)
            })
          }
          await member.kick('Disagreed to Cirilla rule menu').catch((err) => {
            console.log(err)
          })
        } else if (values.includes('live')) {
          for (const id of removed) {
            await member.roles.remove(id.value).catch((err) => {
              console.log(`Role Remove Error: ${err}`)
            })
          }
        } else {
          await member.roles.add(values).catch((err) => {
            console.log(`Role Add Error: ${err}`)
          })
        }
        return SuccessEmbed(interaction, 'Roles updated')
      }
    })
  },

  // Send dropdown
  callback: async ({ client, interaction }) => {
    await interaction.deferReply({ ephemeral: true })
    const channel = interaction.options.getChannel('channel')
    const messageId = interaction.options.getString('message')
    const role = interaction.options.getRole('role')
    const kick = interaction.options.getBoolean('kick') || false
    const aTitle = interaction.options.getString('agree_title')
    const dTitle = interaction.options.getString('disagree_title')
    const aDesc = interaction.options.getString('agree_desc') || `${''}`
    const dDesc = interaction.options.getString('disagree_desc') || `${''}`
    const aEmote = interaction.options.getString('agree_emote')
    const dEmote = interaction.options.getString('disagree_emote')

    if (channel.type !== 'GUILD_TEXT')
      return FailureEmbed(interaction, 'Invalid channel')

    // Get message
    const targetMessage = await channel.messages.fetch(messageId, {
      cache: true,
      force: true,
    })
    // Validate message exists and was written by the bot
    if (!targetMessage) return FailureEmbed(interaction, 'Invalid message Id')
    if (targetMessage.author.id !== client.user.id) {
      return FailureEmbed(
        interaction,
        `Invalid message. Message author must be <@${client.user.id}>.\
         Try using \`/embed\` or \`/say\``
      )
    }

    // Get or create ActionRow if not present
    let row = targetMessage.components[0] as MessageActionRow
    if (!row)
      row = new MessageActionRow({
        type: 1,
        components: [
          {
            type: 3,
            customId: 'cirilla-rules-menu',
            placeholder: 'Select one...',
            minValues: 0,
            maxValues: 1,
            options: [
              {
                label: aTitle ? aTitle : 'Agree',
                value: role.id,
                description: aDesc,
                emoji: aEmote,
              },
              {
                label: dTitle ? dTitle : 'Disagree',
                value: kick ? 'kick' : 'live',
                description: dDesc,
                emoji: dEmote,
              },
            ],
          },
        ],
      })

    const sent = await targetMessage.edit({
      components: [row],
    })

    if (!sent) return FailureEmbed(interaction)
    return SuccessEmbed(interaction, `Dropdown posted in #${channel.name}`)
  },
} as ICommand