import { model, models } from 'mongoose'
import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'
import afkSchema from '../models/afk-schema'

const afkData = {} as {
  // memberId: [message, AFK]
  [key: string]: [string, boolean]
}

export default {
  category: 'Utility',
  description: 'Set/Enable/Disable an afk message',
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,
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

  callback: async ({ member, interaction }) => {
    // Set AFK message
    if (interaction.options.getSubcommand() === 'set') {
      const afkMessage = interaction.options.getString('message')

      await afkSchema
        .findOneAndUpdate(
          {
            _id: member.id,
          },
          {
            _id: member.id,
            text: afkMessage,
            afk: true,
          },
          {
            upsert: true,
          }
        )
        .catch((err) => {
          return FailureEmbed(interaction, err)
        })
      afkData[member.id] = [afkMessage, true]
      return SuccessEmbed(
        interaction,
        `AFK message for ${member.user.tag} has been set and is \`ENABLED\``
      )
    }
    // Toggle on or off
    else if (interaction.options.getSubcommand() === 'toggle') {
      // Get present data
      let data = afkData[member.id]

      if (!data) {
        const results = await afkSchema.findById(member.id)
        if (!results)
          return FailureEmbed(interaction, 'Use `/afk set` and try again')

        const { text, afk } = results

        data = afkData[member.id] = [text, afk]
      }

      await afkSchema
        .findOneAndUpdate(
          {
            _id: member.id,
          },
          {
            _id: member.id,
            text: data[0],
            afk: !data[1],
          }
        )
        .catch((err) => {
          return FailureEmbed(interaction, err)
        })
      afkData[member.id] = [data[0], !data[1]]
      return SuccessEmbed(
        interaction,
        `AFK message for ${member.user.tag} is now \`${
          !data[1] ? 'ENABLED' : 'DISABLED'
        }\``
      )
    }
  },
} as ICommand
