import { ICommand } from 'wokcommands'
import { REVOLVER } from '..'

export default {
  category: 'Fun',
  description: 'Pull the trigger.',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [],

  callback: ({ interaction }) => {
    REVOLVER.fire(interaction)
  },
} as ICommand
