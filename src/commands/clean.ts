import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'

export default {
  category: 'Moderation',
  description: 'Clean up the specified number of messages',
  permissions: ['ADMINISTRATOR'],
  // requireRoles: true,
  slash: true,
  testOnly: true,
  guildOnly: true,
  syntax: '<number>',
  options: [
    {
      name: 'number',
      description: 'The number of messages you want to delete',
      type: 10,
      required: true,
    },
  ],

  callback: async ({ interaction, channel }) => {
    const amount = interaction.options.getNumber('number')

    if (amount < 1 || amount > 99) {
      return FailureEmbed(interaction, 'Specify a number between 1 and 99')
    }

    await channel
      .bulkDelete(amount)
      .then(() => {
        return SuccessEmbed(interaction, `Cleaned up ${amount} messages`)
      })
      .catch((err) => {
        return FailureEmbed(interaction, err)
      })
  },
} as ICommand
