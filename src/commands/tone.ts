import { ICommand } from 'wokcommands'
import { TONE_INDICATORS, TONE } from '../constants/TONE_INDICATORS'
import { FailureEmbed } from '../helpers'

export default {
  category: 'Information',
  description: 'Get a list of tone indicator meanings',
  slash: true,
  testOnly: true,
  options: [
    {
      name: 'indicator',
      description: 'The tone indicator you want a definition for',
      type: 3,
      required: false,
    },
  ],

  callback: ({ interaction }) => {
    const indicator = interaction.options.getString('indicator')

    if (indicator) {
      const match: TONE = TONE_INDICATORS.find(
        (item) => item.name === indicator
      )
      if (!match) {
        return FailureEmbed(
          interaction,
          `No indicator matching ${indicator} found`
        )
      }
      const toneEmbed = {
        color: 0xff9ed7,
        description: match.name + ' | ' + match.shortDesc,
      }
      return interaction.reply({ embeds: [toneEmbed], ephemeral: true })
    }
    const indicators = TONE_INDICATORS.map((tone) => {
      return {
        name: tone.name,
        value: tone.shortDesc,
        inline: true,
      }
    })
    const toneEmbed = { color: 0xff9ed7, fields: indicators }
    return interaction.reply({ embeds: [toneEmbed], ephemeral: true })
  },
} as ICommand
