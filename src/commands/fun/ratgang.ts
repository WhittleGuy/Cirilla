import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'

export default {
  category: 'Fun',
  description: 'Display the RatGang',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: false,
  options: [],

  callback: async ({ message, interaction }) => {
    await interaction.deferReply()

    const emoji = [
      '<:RatGangCat:887203783258570762>',
      '<:RatGangCcat:887203783963181087>',
      '<:RatGangCheese:887203783237582888>',
      '<:RatGangClaire:887203782633615391>',
      '<:RatGangCreature:966071911958327389>',
      '<:RatGangJulio:887203784260988948>',
      '<:RatGangKloud:887203782423883807>',
      '<:RatGangMouse:887203783380205638>',
      '<:RatGangWhittle:887203782927200256>',
      '<:RatGang_Dedos:887203780448370739>',
    ]

    try {
      await interaction.editReply(`${emoji.join(' ')}`)
    } catch {
      await FailureMessage(interaction)
    }
  },
} as ICommand
