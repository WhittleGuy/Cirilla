import { ColorResolvable } from 'discord.js'
import { ICommand } from 'wokcommands'
import { ColorCheck, FailureMessage, SuccessMessage } from '../../helpers'

export default {
  category: 'Utility',
  description: 'Set up a poll',
  permissions: ['MANAGE_MESSAGES'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'channel',
      description: 'Poll channel',
      type: 7,
      required: true,
    },
    {
      name: 'title',
      description: 'Poll title',
      type: 3,
      required: true,
    },
    {
      name: 'options',
      description: 'Options for the poll [<emoji> <string>] separated with | ',
      type: 3,
      required: true,
    },
    {
      name: 'color',
      description: 'Embed color (#ff9ed7)',
      type: 3,
      required: false,
    },
  ],

  callback: async ({ interaction }) => {
    // RegEx to verify emote Ids
    const EMOTE = /^<:[\w\W]+:\d+>$/
    const EMOJI = /\p{Extended_Pictographic}/u
    const EMOTE_ID = /\d{18}/

    const channel = interaction.options.getChannel('channel')
    if (channel.type !== 'GUILD_TEXT')
      return FailureMessage(interaction, 'Please tag a text channel')
    const title = interaction.options.getString('title')
    const options = interaction.options.getString('options')
    const color = interaction.options.getString('color') as ColorResolvable
    const user = interaction.user

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
        return FailureMessage(
          interaction,
          `I don't have access to ${emoteCandidate}`
        )
      }
      if (emoteArray.includes(emote))
        return FailureMessage(interaction, 'Duplicate emote used')
      else {
        emoteArray.push(emote)
      }
    }

    // Create poll
    const poll = await channel.send({
      embeds: [
        {
          color: ColorCheck(color),
          title: title,
          description: optionArray.join('\n'),
          footer: { text: user.id },
          timestamp: new Date(),
        },
      ],
    })

    if (!poll) return FailureMessage(interaction)

    const addReactions = async (emotes: string[]) => {
      for (const emote of emotes) {
        const reaction = await poll.react(emote).catch(() => {
          return
        })
        if (!reaction) {
          FailureMessage(interaction, "I don't have access to that emote")
          poll.delete()
          return false
        }
      }
      return true
    }

    if (await addReactions(emoteArray))
      return SuccessMessage(interaction, 'Poll has been created')
  },
} as ICommand
