import { ICommand } from 'wokcommands'
import axios from 'axios'
import { ColorCheck, SuccessMessage } from '../../helpers'
import { arrayBuffer } from 'stream/consumers'

const LIVE_STREAMERS = []
const STREAMERS = [
  'asterixks',
  'kloudmello',
  'catssnap',
  'vermillionaf',
  'oxillery',
  'dilophomasnaurus',
]
const HELIX = 'https://api.twitch.tv/helix'
let authToken = ''

export default {
  category: 'Information',
  description: 'Get the status of a streamer on Twitch',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: false,
  testOnly: false,
  guildOnly: false,

  init: async (client) => {
    const res = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCHCLIENT}&client_secret=${process.env.TWITCHSECRET}&grant_type=client_credentials`
    )
    authToken = res.data['access_token']

    const twitch = axios.create({
      baseURL: HELIX,
      timeout: 10000,
      headers: {
        'Client-ID': process.env.TWITCHCLIENT,
        Authorization: `Bearer ${authToken}`,
      },
    })

    const checkStatus = async () => {
      for (const i in STREAMERS) {
        try {
          const {
            data: { data: liveData },
          } = await twitch.get(`/streams?user_login=${STREAMERS[i]}`)
          if (liveData.length > 0) {
            if (!LIVE_STREAMERS.includes(STREAMERS[i])) {
              LIVE_STREAMERS.push(STREAMERS[i])
              const {
                data: { data: user },
              } = await twitch.get(`/users?login=${STREAMERS[i]}`)
              client.channels.fetch('495490338035859456').then((channel) =>
                channel.send({
                  embeds: [
                    {
                      color: ColorCheck('STATUS'),
                      thumbnail: {
                        url: user[0].profile_image_url,
                      },
                      image: {
                        url: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${STREAMERS[i]}-960x540.jpg`,
                      },
                      description: `**[${liveData[0].title}](https://www.twitch.tv/${STREAMERS[i]})**
                    \n**Game**\n${liveData[0].game_name}`,
                    },
                  ],
                })
              )
            }
          } else {
            const index = LIVE_STREAMERS.indexOf(STREAMERS[i])
            if (index > -1) {
              LIVE_STREAMERS.splice(index, 1)
            }
          }
        } catch (err) {
          console.log(`TwitchNotify Error: ${err}`)
        }
      }
    }

    setInterval(() => checkStatus(), 60000)
  },

  callback: async ({ interaction }) => {},
} as ICommand
