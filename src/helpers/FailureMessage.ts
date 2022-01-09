import {
  CommandInteraction,
  CacheType,
  SelectMenuInteraction,
  Message,
} from 'discord.js'

const FailureMessage = async (
  input:
    | Message
    | CommandInteraction<CacheType>
    | SelectMenuInteraction<CacheType>,
  err?: string
): Promise<void> => {
  // Generate failure embed
  const failureEmbed = {
    color: 0xff0000,
    description: `${err ? err : 'Error'}`,
  }

  // Message
  if (input instanceof Message) {
    const post = await input.channel.send({ embeds: [failureEmbed] })
    if (!post) return console.error('ERROR: Failure message could not post')
    return
  }

  // Interaction
  if (input.replied || input.deferred) {
    input.editReply({
      embeds: [failureEmbed],
    })
  } else {
    input.reply({
      embeds: [failureEmbed],
      ephemeral: true,
    })
  }
  return
}

export default FailureMessage
