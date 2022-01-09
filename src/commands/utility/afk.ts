import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'
import afkSchema from '../../models/afk-schema'

const afkData = {} as {
  // userId: [message, AFK]
  [key: string]: [string, boolean]
}

export default {
  category: 'Utility',
  description: 'Set/Enable/Disable an afk message',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: false,
  options: [
    {
      name: 'set',
      description: 'Set your afk message',
      type: 1,
      options: [
        {
          name: 'message',
          description: 'Your afk message',
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: 'toggle',
      description: 'Toggle afk message',
      type: 1,
    },
  ],

  callback: async ({ interaction }) => {
    const user = interaction.user
    // Set AFK message
    if (interaction.options.getSubcommand() === 'set') {
      const afkMessage = interaction.options.getString('message')

      await afkSchema
        .findOneAndUpdate(
          {
            _id: user.id,
          },
          {
            _id: user.id,
            text: afkMessage,
            afk: true,
          },
          {
            upsert: true,
          }
        )
        .catch((err) => {
          return FailureMessage(interaction, err)
        })
      afkData[user.id] = [afkMessage, true]
      return SuccessMessage(
        interaction,
        `AFK message for ${user.tag} has been set and is \`ENABLED\``
      )
    }
    // Toggle on or off
    else if (interaction.options.getSubcommand() === 'toggle') {
      // Get present data
      let data = afkData[user.id]

      if (!data) {
        const results = await afkSchema.findById(user.id)
        if (!results)
          return FailureMessage(interaction, 'Use `/afk set` and try again')

        const { text, afk } = results

        data = afkData[user.id] = [text, afk]
      }

      await afkSchema
        .findOneAndUpdate(
          {
            _id: user.id,
          },
          {
            _id: user.id,
            text: data[0],
            afk: !data[1],
          }
        )
        .catch((err) => {
          return FailureMessage(interaction, err)
        })
      afkData[user.id] = [data[0], !data[1]]
      return SuccessMessage(
        interaction,
        `AFK message for ${user.tag} is now \`${
          !data[1] ? 'ENABLED' : 'DISABLED'
        }\``
      )
    }
  },
} as ICommand
