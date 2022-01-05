import { fail } from 'assert'
import { CommandInteraction, CacheType } from 'discord.js'

const FailureEmbed = (
  interaction: CommandInteraction<CacheType>,
  err?: string
): void => {
  const failureEmbed = {
    color: 0xff0000,
    title: 'Something went wrong...',
    description: `${err ? '```' + err + '```' : ''}`,
  }

  if (interaction.replied || interaction.deferred) {
    //console.log('Try editReply')
    interaction.editReply({ embeds: [failureEmbed] })
  } else {
    //console.log('Try reply')
    interaction.reply({ embeds: [failureEmbed], ephemeral: true })
  }
  return
}

export default FailureEmbed
