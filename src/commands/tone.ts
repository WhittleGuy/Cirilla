import { ICommand } from 'wokcommands'
import { TONE_INDICATORS, TONE } from '../constants/TONE_INDICATORS'

export default {
  category: 'Utility',
  description: 'Get a list of tone indicator meanings',
  slash: true,
  testOnly: true,
  syntax: '[indicator]',
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
        const failureEmbed = {
          color: 0xff0000,
          description: `No indicator matching ${indicator} found`,
        }
        return interaction.reply({ embeds: [failureEmbed], ephemeral: true })
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
