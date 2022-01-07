import { ICommand } from 'wokcommands'
import { REVOLVER } from '..'

export default {
  category: 'Fun',
  description: "Sit down with your friends, play a game. It'll be fun.",
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
