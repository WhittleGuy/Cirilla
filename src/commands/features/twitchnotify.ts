import { ICommand } from 'wokcommands'
import axios from 'axios'
import {
  ColorCheck,
  FailureMessage,
  SendError,
  SuccessMessage,
} from '../../helpers'
import twitchNotifySchema from '../../models/twitchNotifySchema'

interface Streamer {
  channel: string
  live: boolean
}

const twitchNotifyData = {} as {
  [key: string]: {
    channel: string
    streamers: Streamer[]
  }
}
const helixURL = 'https://api.twitch.tv/helix'
let authToken = ''

const liveEmbed = (username, userIconURL, channel, title, game) => {
  return {
    color: ColorCheck('STATUS'),
    thumbnail: {
      url: userIconURL,
    },
    image: {
      url: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel}-960x540.jpg`,
    },
    title: `${username} is live!`,
    description: `**[${title}](https://www.twitch.tv/${channel})**
                    \n**Game**\n${game}`,
  }
}

export default {
  category: 'Configuration',
  description: 'Set up Twitch Live notifications',
  permissions: ['ADMINISTRATOR'],
  // requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'set',
      description: 'Set the channel for Twitch live notifications',
      type: 1,
      options: [
        {
          name: 'channel',
          description:
            'The channel you want to send Twitch Live Notifications to',
          type: 7,
          required: true,
        },
      ],
    },
    {
      name: 'add',
      description: 'Add a streamer to monitor',
      type: 1,
      options: [
        {
          name: 'streamer',
          description: 'The Twitch channel you want to add',
          type: 3,
          required: true,
        },
      ],
    },
  ],

  init: async (client) => {
    const results = await twitchNotifySchema.find()
    for (const res of results) {
      twitchNotifyData[res._id] = res
    }

    const res = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCHCLIENT}&client_secret=${process.env.TWITCHSECRET}&grant_type=client_credentials`
    )
    authToken = res.data['access_token']

    const twitch = axios.create({
      baseURL: helixURL,
      timeout: 10000,
      headers: {
        'Client-ID': process.env.TWITCHCLIENT,
        Authorization: `Bearer ${authToken}`,
      },
    })

    const checkStatus = async () => {
      for (const guild in twitchNotifyData) {
        const guildData = twitchNotifyData[guild]
        for (const i in guildData.streamers) {
          const streamer = guildData.streamers[i]
          const { channel, live } = streamer

          // Attempt to check status
          try {
            const {
              data: { data: liveData },
            } = await twitch.get(`/streams?user_login=${channel}`)

            if (liveData.length > 0) {
              // don't repost live notifications for the same stream
              if (live === false) {
                const {
                  data: { data: user },
                } = await twitch.get(`/users?login=${channel}`)

                // post embed
                const ch = await client.channels.cache.get(guildData.channel)
                const notificationSent = await ch.send({
                  embeds: [
                    liveEmbed(
                      user[0].display_name,
                      user[0].profile_image_url,
                      channel,
                      liveData[0].title,
                      liveData[0].game_name
                    ),
                  ],
                })

                if (notificationSent) {
                  // Update local data
                  twitchNotifyData[guild].streamers[i].live = true
                }
              }
            } else {
              if (live === true) {
                twitchNotifyData[guild].streamers[i].live = false
              }
            }
          } catch (err) {
            SendError('twitchNotify.ts', null, null, err)
          }
        }
      }
    }

    setInterval(() => checkStatus(), 60000)
  },

  callback: async ({ interaction, guild }) => {
    if (interaction.options.getSubcommand() === 'set') {
      const channel = interaction.options.getChannel('channel')

      // Validate channel
      if (channel.type !== 'GUILD_TEXT')
        return FailureMessage(interaction, 'Please tag a text channel')

      // If valid, update local data
      const data = twitchNotifyData[guild.id]

      if (!data) {
        twitchNotifyData[guild.id] = {
          channel: channel.id,
          streamers: [],
        }
      } else {
        data.channel = channel.id
      }

      // Update DB
      const set = await twitchNotifySchema.findOneAndUpdate(
        {
          _id: guild.id,
        },
        {
          _id: guild.id,
          channel: channel.id,
          streamers: data ? data.streamers : [],
        },
        {
          upsert: true,
        }
      )

      if (set)
        return SuccessMessage(interaction, 'Twitch notification channel set.')
    } else if (interaction.options.getSubcommand() === 'add') {
      const streamer = interaction.options.getString('streamer')

      const data = twitchNotifyData[guild.id]

      if (!data) {
        return FailureMessage(
          interaction,
          'Please set a notification channel first'
        )
      }

      // Update local data
      data.streamers.push({
        channel: streamer,
        live: false,
      })

      // Update DB
      const set = await twitchNotifySchema.findOneAndUpdate(
        {
          _id: guild.id,
        },
        {
          _id: guild.id,
          channel: data.channel,
          streamers: data.streamers,
        },
        {
          upsert: true,
        }
      )

      if (set) return SuccessMessage(interaction, 'Streamer added')
    }
  },
} as ICommand
