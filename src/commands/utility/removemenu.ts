import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'

export default {
  category: 'CirillaRoles',
  description: 'Remove dropdown from Cirilla message',
  permissions: ['MANAGE_MESSAGES'],
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

  callback: async ({ interaction }) => {
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
    const removed = await targetMessage.edit({ components: [] })
    if (removed) SuccessMessage(interaction, 'Dropdown removed')
  },
} as ICommand
