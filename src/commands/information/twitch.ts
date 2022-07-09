import { ICommand } from 'wokcommands'
import axios from 'axios'
import { ColorCheck, SendError, SuccessMessage } from '../../helpers'

const HELIX = 'https://api.twitch.tv/helix'
let authToken = ''

export default {
  category: 'Information',
  description: 'Get the status of a streamer on Twitch',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: false,
  options: [
    {
      name: 'streamer',
      description: "The streamer's status you want to check",
      type: 3,
      required: true,
    },
  ],

  init: async () => {
    try {
      const res = await axios.post(
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCHCLIENT}&client_secret=${process.env.TWITCHSECRET}&grant_type=client_credentials`
      )
      authToken = res.data['access_token']
    } catch (err) {
      SendError('twitch.ts', null, null, err)
    }
  },

  callback: async ({ interaction }) => {
    await interaction.deferReply()
    const streamer = interaction.options.getString('streamer').toLowerCase()

    const twitch = axios.create({
      baseURL: HELIX,
      timeout: 5000,
      headers: {
        'Client-ID': process.env.TWITCHCLIENT,
        Authorization: `Bearer ${authToken}`,
      },
    })

    try {
      // Get Twitch user
      const {
        data: { data: user },
      } = await twitch.get(`/users?login=${streamer}`, {
        timeout: 5000,
      })

      // User does not exist
      if (!user.length) {
        await interaction.editReply({
          embeds: [
            {
              color: ColorCheck('WARN'),
              description: `**${streamer} Not Found**`,
            },
          ],
        })
        return
      }

      // User exists, get stream info
      else {
        const {
          data: { data: data },
        } = await twitch.get(`/streams?user_login=${streamer}`, {
          timeout: 5000,
        })
        const stream = data[0]

        if (!stream) {
          interaction.editReply({
            embeds: [
              {
                color: ColorCheck('REMOVE'),
                description: `**[${streamer}](https://www.twitch.tv/${streamer}) is offline**`,
              },
            ],
          })
        } else if (stream?.type === 'live') {
          interaction.editReply({
            embeds: [
              {
                color: ColorCheck('ADD'),
                title: `**${stream?.user_name} is live!**`,
                thumbnail: {
                  url: user[0].profile_image_url,
                },
                fields: [
                  {
                    name: 'Title',
                    value: `[${stream.title}](https://www.twitch.tv/${streamer})`,
                    inline: false,
                  },
                  {
                    name: 'Game',
                    value: stream.game_name,
                    inline: false,
                  },
                  {
                    name: 'Viewers',
                    value: stream.viewer_count.toString(),
                    inline: true,
                  },
                  {
                    name: 'Language',
                    value: stream.language.toUpperCase(),
                    inline: true,
                  },
                  {
                    name: 'Mature',
                    value: stream.is_mature ? 'True' : 'False',
                    inline: true,
                  },
                ],
              },
            ],
          })
        }
      }
    } catch (err) {
      SendError('twitch.ts', null, null, err)
    }
  },
} as ICommand
