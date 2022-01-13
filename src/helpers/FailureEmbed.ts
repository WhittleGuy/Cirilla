import {
  CommandInteraction,
  CacheType,
  SelectMenuInteraction,
} from 'discord.js'

const FailureEmbed = (
  interaction: CommandInteraction<CacheType> | SelectMenuInteraction<CacheType>,
  err?: string
): void => {
  const failureEmbed = {
    color: 0xff0000,
    title: 'Something went wrong...',
    description: `${err ? '```' + err + '```' : ''}`,
  }

  if (interaction.replied || interaction.deferred) {
    //console.log('Try editReply')
    interaction.editReply({
      embeds: [failureEmbed],
      allowedMentions: { roles: [] },
    })
  } else {
    //console.log('Try reply')
    interaction.reply({
      embeds: [failureEmbed],
      allowedMentions: { roles: [] },
      ephemeral: true,
    })
  }
  return
}

export default FailureEmbed
