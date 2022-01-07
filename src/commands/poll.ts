import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'

export default {
  category: 'Utility',
  description: 'Set up a poll',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: true,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'channel',
      description: 'The channel to post the poll in',
      type: 7,
      required: true,
    },
    {
      name: 'title',
      description: 'The title of the poll',
      type: 3,
      required: true,
    },
    {
      name: 'options',
      description: 'Options for the poll, separated by | and led by an emoji',
      type: 3,
      required: true,
    },
  ],

  callback: async ({ interaction }) => {
    // RegEx to verify emote Ids
    const EMOTE = /^<:[\w\W]+:\d+>$/
    const EMOJI = /\p{Extended_Pictographic}/u
    const EMOTE_ID = /\d{18}/

    const channel = interaction.options.getChannel('channel')
    if (channel.type !== 'GUILD_TEXT')
      return FailureEmbed(interaction, 'Please tag a text channel')
    const title = interaction.options.getString('title')
    const options = interaction.options.getString('options')
    const optionArray = options.split('|')
    const emoteArray: string[] = []
    await interaction.deferReply({ ephemeral: true })
    // Separate options and verify emote presence
    for (const option of optionArray) {
      const emoteCandidate = option.trim().split(' ')[0] || option

      let emote = ''
      if (emoteCandidate.match(EMOTE)) {
        emote = EMOTE_ID.exec(emoteCandidate)[0]
      } else if (emoteCandidate.match(EMOJI)) {
        emote = emoteCandidate
      } else {
        return FailureEmbed(
          interaction,
          `I don't have access to ${emoteCandidate}`
        )
      }
      if (emoteArray.includes(emote))
        return FailureEmbed(interaction, 'Duplicate emote used')
      else {
        emoteArray.push(emote)
      }
    }

    // Create poll
    const poll = await channel.send({
      embeds: [
        {
          color: 0xff9ed7,
          title: title,
          description: optionArray.join('\n'),
        },
      ],
    })

    if (!poll) return FailureEmbed(interaction)

    const addReactions = async (emotes: string[]) => {
      for (const emote of emotes) {
        const reaction = await poll.react(emote).catch(() => {
          return
        })
        if (!reaction) {
          FailureEmbed(interaction, "I don't have access to that emote")
          poll.delete()
          return false
        }
      }
      return true
    }

    if (await addReactions(emoteArray))
      return SuccessEmbed(interaction, 'Poll has been created')
  },
} as ICommand
