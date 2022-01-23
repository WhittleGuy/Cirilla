import { ICommand } from 'wokcommands'
import axios from 'axios'
import { ColorCheck, SuccessMessage } from '../../helpers'

const HELIX = 'https://api.twitch.tv/helix'

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

  callback: async ({ interaction }) => {
    await interaction.deferReply()
    const streamer = interaction.options.getString('streamer').toLowerCase()

    const twitch = axios.create({
      baseURL: HELIX,
      timeout: 5000,
      headers: {
        'Client-ID': process.env.TWITCHCLIENT,
        Authorization: 'Bearer ugarzk1dpgdfy2u0eakcbenngb5rgl',
      },
    })

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
  },
} as ICommand
