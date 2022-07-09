import { ICommand } from 'wokcommands'
import { FailureMessage, SendError, SuccessMessage } from '../../helpers'

export default {
  category: 'Moderation',
  description: 'Delete multiple messages',
  permissions: ['MANAGE_MESSAGES'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'number',
      description: 'Number of messages to delete',
      type: 10,
      required: true,
    },
  ],

  callback: async ({ interaction, channel, guild, member }) => {
    const amount = interaction.options.getNumber('number')

    if (amount < 1 || amount > 99) {
      return FailureMessage(interaction, 'Specify a number between 1 and 99')
    }

    try {
      await channel.bulkDelete(amount).then(() => {
        return SuccessMessage(interaction, `Cleaned up ${amount} messages`)
      })
    } catch (err) {
      SendError('clean.ts', guild, member, err)
      return FailureMessage(interaction, `${err}`)
    }
  },
} as ICommand
