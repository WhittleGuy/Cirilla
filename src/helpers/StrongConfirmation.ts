import { CacheType, CommandInteraction } from 'discord.js'
import { FailureMessage, SuccessMessage } from '.'

const StrongConfirmation = async (
  interaction: CommandInteraction<CacheType>,
  title: string,
  description: string,
  confirmButtonTitle: string,
  success: () => void
) => {
  await interaction.reply({
    embeds: [
      {
        color: 0x36393f,
        title: title,
        description: description,
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
            customId: 'cirilla-cancel',
          },
          {
            type: 2,
            label: 'Proceed',
            style: 4,
            customId: 'cirilla-confirm',
          },
        ],
      },
    ],
  })

  const filter = (i) => {
    i.deferUpdate()
    return i.member.user.id === interaction.member.user.id
  }

  await interaction.channel
    .awaitMessageComponent({ filter, componentType: 'BUTTON', time: 30000 })
    .then(async (button) => {
      if (button.customId === 'cirilla-confirm') {
        success()
        return
      } else if (button.customId === 'cirilla-cancel') {
        FailureMessage(interaction, 'Action cancelled')
      }
    })
    .catch(() => {
      return FailureMessage(interaction, 'Confirmation timed out')
    })
}

export default StrongConfirmation
