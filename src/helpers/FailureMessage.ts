import {
  CommandInteraction,
  CacheType,
  SelectMenuInteraction,
  Message,
} from 'discord.js'
import { ColorCheck } from '.'

const FailureMessage = async (
  input:
    | Message
    | CommandInteraction<CacheType>
    | SelectMenuInteraction<CacheType>,
  err?: string
): Promise<void> => {
  // Generate failure embed
  const failureEmbed = {
    color: ColorCheck('REMOVE'),
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
    await input
      .editReply({
        embeds: [failureEmbed],
        components: [],
      })
      .catch((err) =>
        console.log(`Guild: ${input.guild.name}
      Member: ${input.member.user.username}
      Input: ${input.toString}
      Err: ${err}`)
      )
  } else {
    await input
      .reply({
        embeds: [failureEmbed],
        components: [],
        ephemeral: true,
      })
      .catch((err) =>
        console.log(`Guild: ${input.guild.name}
      Member: ${input.member.user.username}
      Input: ${input.toString}
      Err: ${err}`)
      )
  }
  return
}

export default FailureMessage
