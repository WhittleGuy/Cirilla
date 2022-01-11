import { MembershipScreeningFieldType } from 'discord-api-types'
import { Permissions, TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'
import confessionChSchema from '../../models/confession-ch-schema'

const confessionData = {} as {
  // guildId: [channel]
  [key: string]: TextChannel
}

export default {
  category: 'Fun',
  description: 'Set up or post to an anonymous confession channel',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: 'both',
  testOnly: false,
  guildOnly: false,
  options: [
    {
      type: 1,
      name: 'set',
      description: 'Set the confessions channel',
      options: [
        {
          name: 'channel',
          description: 'The channel to send confessions to',
          type: 7,
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: 'post',
      description: 'Send a confession',
      options: [
        {
          name: 'confession',
          description: 'What should the confession message say?',
          type: 3,
          required: true,
        },
      ],
    },
  ],

  callback: async ({ guild, member, interaction }) => {
    // Set Channel
    if (interaction.options.getSubcommand() === 'set') {
      // Validate user
      if (!member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) {
        return FailureMessage(interaction)
      }

      const channel = interaction.options.getChannel('channel')
      // Validate channel
      if (channel.type !== 'GUILD_TEXT')
        return FailureMessage(interaction, 'Invalid channel type')
      // Push to DB and store locally
      const set = await confessionChSchema.findOneAndUpdate(
        {
          _id: guild.id,
        },
        {
          _id: guild.id,
          channelId: channel,
        },
        { upsert: true }
      )
      confessionData[guild.id] = channel

      if (!set) return FailureMessage(interaction)
      return SuccessMessage(
        interaction,
        `Confessions channel set to #${channel.name}`
      )
    }

    // Send confession
    if (interaction.options.getSubcommand() === 'post') {
      let data = confessionData[guild.id]

      if (!data) {
        const res = await confessionChSchema.findById(guild.id)
        if (!res) return FailureMessage(interaction, 'No confession channel')
        const { channelId } = res
        const channel = guild.channels.cache.get(channelId) as TextChannel
        data = confessionData[guild.id] = channel
      }

      const confession = interaction.options.getString('confession')

      const sent = await data.send({
        embeds: [
          {
            color: 'RANDOM',
            description: confession,
          },
        ],
      })

      if (!sent) return FailureMessage(interaction)
      return SuccessMessage(interaction)
    }
  },
} as ICommand
