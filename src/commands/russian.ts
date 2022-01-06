import { ICommand } from 'wokcommands'
import { REVOLVER } from '..'

export default {
  category: 'Fun',
  description: "Sit down with your friends, play a game. It'll be function.",
  slash: true,
  testOnly: false,

  callback: ({ interaction }) => {
    REVOLVER.fire(interaction)
  },
} as ICommand
