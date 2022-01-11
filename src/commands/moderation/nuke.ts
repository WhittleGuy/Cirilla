import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'

export default {
  category: 'Moderation',
  description: 'Delete a channel and create an empty clone of it',
  permissions: ['MANAGE_MESSAGES', 'MANAGE_CHANNELS'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'channel',
      description: 'Channel to nuke',
      type: 7,
      required: true,
    },
  ],

  callback: async ({ interaction }) => {
    const channel = interaction.options.getChannel('channel')

    if (channel.type !== 'GUILD_TEXT')
      return FailureMessage(interaction, 'Invalid channel type')

    await interaction.reply({
      embeds: [
        {
          color: 0x36393f,
          title: `Nuke #${channel.name}?`,
          description: `Are you sure you want to nuke #${channel.name}? This action is irreversible.`,
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: 'Cancel',
              style: 2,
              customId: 'cirilla-nuke-cancel',
            },
            {
              type: 2,
              label: 'Nuke',
              style: 4,
              customId: 'cirilla-nuke-confirm',
            },
          ],
        },
      ],
    })

    const filter = (i) => {
      i.deferUpdate()
      return i.member.user.id === interaction.member.user.id
    }

    await channel
      .awaitMessageComponent({ filter, componentType: 'BUTTON', time: 30000 })
      .then(async (button) => {
        if (button.customId === 'cirilla-nuke-confirm') {
          SuccessMessage(interaction, 'Nuke confirmed. Proceeding in 5s...')
          return setTimeout(async () => {
            await channel.delete()
            const cloneChannel = await channel.clone()
            await cloneChannel.setPosition(channel.position)
          }, 5000)
        } else if (button.customId === 'cirilla-nuke-cancel') {
          return SuccessMessage(interaction, 'Nuke cancelled')
        }
      })
      .catch(() => {
        return FailureMessage(interaction, 'Confirmation timed out')
      })
  },
} as ICommand
