import { ICommand } from 'wokcommands'

export default {
  category: 'Utility',
  description: 'Set/Enable/Disable an afk message',
  permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: true,
  guildOnly: false,
  options: [],

  callback: async ({ interaction }) => {
    console.log(undefined || true || false)
  },
} as ICommand
