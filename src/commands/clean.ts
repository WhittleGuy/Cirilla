import { ICommand } from 'wokcommands'
import { FailureEmbed } from '../helpers/FailureEmbed'

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

  callback: ({ interaction, channel }) => {
    const amount = interaction.options.getNumber('number')
    if (amount < 1 || amount > 99) {
      return FailureEmbed(interaction, 'Specify a number between 1 and 99')
    }

    channel
      .bulkDelete(amount)
      .then(() => {
        interaction.reply({
          embeds: [
            {
              color: 0x00ff00,
              description: `Cleaned up ${amount} messages`,
            },
          ],
        })
        setTimeout(() => interaction.deleteReply(), 3000)
      })
      .catch((err) => {
        return FailureEmbed(interaction, err)
      })
  },
} as ICommand
