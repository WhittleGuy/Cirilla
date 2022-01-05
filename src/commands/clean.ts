import { ICommand } from 'wokcommands'

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
      return interaction.reply({
        embeds: [
          {
            color: 0xff8e14,
            description: 'Specify a number of messages between 1 and 99',
          },
        ],
        ephemeral: true,
      })
    }

    channel
      .bulkDelete(amount)
      .then(() => {
        return interaction.reply({
          embeds: [
            {
              color: 0x00ff00,
              description: `Cleaned up ${amount} messages`,
            },
          ],
          ephemeral: true,
        })
      })
      .catch((err) => {
        return interaction.reply({
          embeds: [
            {
              color: 0xff0000,
              description: `Something went wrong:\n${err}`,
            },
          ],
          ephemeral: true,
        })
      })
  },
} as ICommand
