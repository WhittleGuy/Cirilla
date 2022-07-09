import { ICommand } from 'wokcommands'
import { FailureMessage, SendError, SuccessMessage } from '../../helpers'

export default {
  category: 'CirillaRoles',
  description: 'Remove dropdown from Cirilla message',
  permissions: ['MANAGE_MESSAGES', 'MANAGE_ROLES'],
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
  ],

  callback: async ({ client, interaction, guild, member }) => {
    interaction.deferReply({ ephemeral: true })
    const channel = interaction.options.getChannel('channel')
    if (channel.type !== 'GUILD_TEXT')
      return FailureMessage(interaction, 'Invalid channel')
    const messageId = interaction.options.getString('message')
    const targetMessage = await channel.messages.fetch(messageId, {
      cache: true,
      force: true,
    })
    if (!targetMessage) return FailureMessage(interaction, 'Invalid message Id')
    if (targetMessage.author.id !== client.user.id) {
      return FailureMessage(
        interaction,
        `Invalid message. Message author must be <@${client.user.id}>.\
         Try using \`/embed\` or \`/say\``
      )
    }
    try {
      await targetMessage.edit({ components: [] })
    } catch (err) {
      SendError('removemenu.ts', guild, member, err)
      return FailureMessage(interaction, `${err}`)
    }
    return SuccessMessage(interaction, 'Dropdown removed')
  },
} as ICommand
