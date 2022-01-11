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
    console.log('Message part')
    const post = await input.channel.send({ embeds: [successEmbed] })
    await input.delete().catch((err) => console.error(err))
    if (!post) return console.error('ERROR: Failure message could not post')
    return
  }

  // Interaction
  if (input.replied || input.deferred) {
    await input
      .editReply({
        embeds: [successEmbed],
        components: [],
      })
      .catch((err) => console.log(err))
  } else {
    await input
      .reply({
        embeds: [successEmbed],
        components: [],
        ephemeral: true,
      })
      .catch((err) => console.log(err))
  }
  return
}

export default SuccessMessage
