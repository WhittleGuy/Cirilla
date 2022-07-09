import { ICommand } from 'wokcommands'
import {
  ColorCheck,
  FailureMessage,
  SendError,
  SuccessMessage,
} from '../../helpers'

export default {
  category: 'Fun',
  description: 'Roll di(c)e',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: false,
  options: [
    {
      name: 'dice',
      description: 'The di(c)e to roll <#d##>',
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

  callback: async ({ guild, member, interaction }) => {
    const diceString = interaction.options.getString('dice')
    const hide = interaction.options.getBoolean('hide')

    const DIE = /\d?d\d+/
    const SEPARATOR = /\W?and\W?|\W?\+\W?|\s{1}|\W?,\W?/

    const dice: string[] = diceString.split(SEPARATOR)
    const dieArray: string[][] = []
    for (const die of dice) {
      if (!die.match(DIE)) return FailureMessage(interaction, 'Invalid format')
      dieArray.push(die.split('d'))
    }

    let total = 0
    let scores: string[] = []

    for (const die of dieArray) {
      if (die[0] === '0') return SuccessMessage(interaction, `Natural 0`)
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

    try {
      await interaction.reply({
        embeds: [
          {
            color: ColorCheck('STATUS'),
            description: `${scores.join(
              '\n'
            )}\n------------------\n**Total:\t${total}**`,
          },
        ],
        ephemeral: hide,
      })
    } catch (err) {
      SendError('roll.ts', guild, member, err)
      return FailureMessage(interaction, 'Something went wrong...')
    }
  },
} as ICommand
