import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'

export default {
  category: 'Fun',
  description: 'Get information about yourself or another user',
  slash: true,
  testOnly: true,
  syntax: '[user]',
  options: [
    {
      name: 'dice',
      description: 'The di(c)e you want to roll',
      type: 3,
      required: true,
    },
    {
      name: 'hide',
      description: 'Hide the roll',
      type: 5,
      required: false,
    },
  ],

  callback: ({ interaction }) => {
    const diceString = interaction.options.getString('dice')
    const hide = interaction.options.getBoolean('hide')

    const DIE = /\d?d\d+/
    const SEPARATOR = /\W?and\W?|\W?\+\W?|\s{1}|\W?,\W?/

    const dice: string[] = diceString.split(SEPARATOR)
    const dieArray: string[][] = []
    for (const die of dice) {
      if (!die.match(DIE)) return FailureEmbed(interaction)
      dieArray.push(die.split('d'))
    }

    let total = 0
    let scores: string[] = []

    for (const die of dieArray) {
      if (die[0] === '0') return SuccessEmbed(interaction, `Natural 0`, false)
      for (let i = 0; i < parseInt(die[0]); i++) {
        const roll = Math.floor(Math.random() * parseInt(die[1]) + 1)
        total += roll
        const nat20 = roll === 20 && parseInt(die[1]) === 20
        const nat1 = roll === 1 && parseInt(die[1]) === 20
        scores.push(
          `[d${die[1]}] | ${roll.toString()} ${
            nat20 ? '**NAT 20**' : nat1 ? '**NAT 1**' : ''
          } `
        )
      }
    }

    return SuccessEmbed(
      interaction,
      `${scores.join('\n')}\n------------------\n**Total:\t${total}**`,
      !hide
    )
  },
} as ICommand
