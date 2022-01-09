import {
  CommandInteraction,
  CacheType,
  SelectMenuInteraction,
  Message,
} from 'discord.js'

const SuccessMessage = async (
  input:
    | Message
    | CommandInteraction<CacheType>
    | SelectMenuInteraction<CacheType>,
  msg?: string
): Promise<void> => {
  // Generate success embed
  const successEmbed = {
    color: 0x00ff00,
    description: `${msg ? msg : 'Success'}`,
  }

  // Message
  if (input instanceof Message) {
    const post = await input.channel.send({ embeds: [successEmbed] })
    await input.delete().catch((err) => console.error(err))
    if (!post) return console.error('ERROR: Failure message could not post')
    return
  }

  // Interaction
  if (input.replied || input.deferred) {
    input.editReply({
      embeds: [successEmbed],
    })
  } else {
    input.reply({
      embeds: [successEmbed],
      ephemeral: true,
    })
  }
  return
}

export default SuccessMessage
