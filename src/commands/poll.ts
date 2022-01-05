import { ICommand } from 'wokcommands'

export default {
  category: 'Utility',
  description: 'Set up a poll',
  permissions: ['ADMINISTRATOR'],
  // requireRoles: true,
  slash: true,
  testOnly: true,
  guildOnly: true,
  options: [
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
    // Status embeds
    const failureEmbed = {
      color: 0xff0000,
      description: `Something went wrong`,
    }
    const successEmbed = {
      color: 0x00ff00,
      description: 'Poll has been created',
    }

    // RegEx to verify emote Ids
    const EMOTE = /^<:[\w\W]+:\d+>$/
    const EMOJI = /\p{Extended_Pictographic}/u
    const EMOTE_ID = /\d{18}/

    const title = interaction.options.getString('title')
    const options = interaction.options.getString('options')
    const optionArray = options.split('|')
    const emoteArray: string[] = []

    // Separate options and verify emote presence
    for (const option of optionArray) {
      const emoteCandidate = option.trim().split(' ')[0] || option

      if (emoteCandidate.match(EMOTE)) {
        emoteArray.push(EMOTE_ID.exec(emoteCandidate)[0])
      } else if (emoteCandidate.match(EMOJI)) {
        emoteArray.push(emoteCandidate)
      } else {
        console.log('Emoji check throw')
        return interaction.reply({
          embeds: [failureEmbed],
        })
      }
    }

    interaction.deferReply({ ephemeral: true })
    // Create poll
    const poll = await interaction.channel.send({
      embeds: [
        {
          color: 0xff9ed7,
          title: title,
          description: optionArray.join('\n'),
        },
      ],
    })

    if (!poll) {
      interaction.editReply({ embeds: [failureEmbed] })
    }

    const addReactions = async (emotes: string[]) => {
      for (const emote of emotes) {
        const reaction = await poll.react(emote).catch(() => {
          return
        })
        if (!reaction) {
          interaction.editReply({
            embeds: [
              {
                color: 0xff0000,
                description: `I don't have access to ${emote}`,
              },
            ],
          })
          poll.delete()
          return false
        }
      }
      return true
    }

    if (await addReactions(emoteArray))
      interaction.editReply({ embeds: [successEmbed] })
  },
} as ICommand
