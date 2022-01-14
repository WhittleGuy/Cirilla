import { ICommand } from 'wokcommands'
import { TONE_INDICATORS, TONE } from '../../constants/TONE_INDICATORS'
import { ColorCheck, FailureMessage } from '../../helpers'

export default {
  category: 'Information',
  description: 'List common tone indicators and their meanings',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: false,
  options: [
    {
      name: 'indicator',
      description: 'Specific tone indicator',
      type: 3,
      required: false,
    },
    {
      name: 'show',
      description: 'Display response for all users',
      type: 5,
      required: false,
    },
  ],

  callback: async ({ interaction }) => {
    const indicator = interaction.options.getString('indicator')
    const show = interaction.options.getBoolean('show') || false
    await interaction.deferReply({ ephemeral: !show })

    if (indicator) {
      const match: TONE = TONE_INDICATORS.find(
        (item) => item.name.replace('/', '') === indicator.replace('/', '')
      )
      if (!match) {
        return FailureMessage(
          interaction,
          `No indicator matching ${indicator} found`
        )
      }
      const toneEmbed = {
        color: ColorCheck('STATUS'),
        description: match.name + ' | ' + match.shortDesc,
      }
      await interaction.editReply({ embeds: [toneEmbed] })
      return
    }
    const indicators = TONE_INDICATORS.map((tone) => {
      return {
        name: tone.name,
        value: tone.shortDesc,
        inline: true,
      }
    })
    const toneEmbed = { color: ColorCheck(), fields: indicators }
    await interaction.editReply({ embeds: [toneEmbed] })
    return
  },
} as ICommand
