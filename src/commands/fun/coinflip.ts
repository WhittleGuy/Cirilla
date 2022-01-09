import { ICommand } from 'wokcommands'
import { SuccessMessage } from '../../helpers'

export default {
  category: 'Fun',
  description: 'Flip a coin',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: 'both',
  testOnly: false,
  guildOnly: false,
  options: [],

  callback: ({ message, interaction }) => {
    const side = Math.round(Math.random())
    SuccessMessage(message || interaction, side ? '😍 Heads' : '🍑 Tails')
  },
} as ICommand
