import { ColorResolvable, GuildTextBasedChannel, Message } from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureEmbed, SuccessEmbed } from '../helpers'
import { ColorCheck } from '../helpers/ColorCheck'

export default {
  category: 'Utility',
  description: 'Manage a raffle',
  permissions: ['MANAGE_MESSAGES'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'start',
      description: 'Post a raffle embed',
      type: 1,
      options: [
        {
          name: 'channel',
          description: 'Raffle channel',
          type: 7,
          required: true,
        },
        {
          name: 'title',
          description: 'Raffle title',
          type: 3,
          required: true,
        },
        {
          name: 'description',
          description: 'Raffle description',
          type: 3,
          required: false,
        },
        {
          name: 'color',
          description: 'Embed color (#ff9ed7)',
          type: 3,
          required: false,
        },
      ],
    },
    {
      name: 'draw',
      description: 'Choose a winner',
      type: 1,
      options: [
        {
          name: 'channel',
          description: 'The channel the raffle message is posted in',
          type: 7,
          required: true,
        },
        {
          name: 'message',
          description: 'The id of the raffle message',
          type: 3,
          required: true,
        },
      ],
    },
  ],

  callback: async ({ interaction }) => {
    // Start a raffle
    if (interaction.options.getSubcommand() === 'start') {
      const channel = interaction.options.getChannel('channel')
      if (channel.type !== 'GUILD_TEXT')
        return FailureEmbed(interaction, 'Please tag a text channel')
      const title = interaction.options.getString('title')
      const description = interaction.options.getString('description')
      const color = interaction.options.getString('color') as ColorResolvable

      const postRaffle = async (
        channel: GuildTextBasedChannel,
        title: string,
        description: string
      ) => {
        await interaction.deferReply({ ephemeral: true })
        const post = await channel
          .send({
            embeds: [
              {
                color: ColorCheck(color),
                title: title,
                description: description || null,
              },
            ],
          })
          .catch((err) => {
            return FailureEmbed(interaction, err)
          })
        if (post) {
          const reaction = await post.react('❤').catch(() => {
            return
          })
          if (!reaction) {
            FailureEmbed(interaction)
            return false
          }
        }
        return true
      }

      if (await postRaffle(channel, title, description)) {
        SuccessEmbed(
          interaction,
          `Raffle post has been created in <#${channel.id}>`
        )
      }

      // Select a winner
    } else if (interaction.options.getSubcommand() === 'draw') {
      const channel = interaction.options.getChannel('channel')
      if (channel.type !== 'GUILD_TEXT')
        return FailureEmbed(interaction, 'Please tag a text channel')
      const message = interaction.options.getString('message')

      const pickWinner = async (channel, message) => {
        await interaction.deferReply({ ephemeral: true })
        const msg: Message = await channel.messages.fetch(message)

        if (!msg) {
          FailureEmbed(interaction)
          return false
        }
        if (msg.reactions.cache.size < 1) {
          FailureEmbed(interaction)
          return false
        }

        const participants = await msg.reactions.cache
          .first()
          .users.fetch()
          .catch(() => {
            return
          })
        if (participants) {
          const winner = participants.filter((user) => !user.bot).random()
          const { title, description } = msg.embeds[0]
          msg.channel
            .send({
              embeds: [
                {
                  color: 0xff9ed7,
                  title: `Winner - ${winner.tag} !`,
                  description: `**${title}**${
                    description ? '\n' + description : ''
                  }`,
                },
              ],
            })
            .catch((err) => {
              return FailureEmbed(interaction, err)
            })
          return winner
        }
      }

      const winner = await pickWinner(channel, message)
      if (!winner) return FailureEmbed(interaction)
      return SuccessEmbed(interaction, `${winner.tag} has won the raffle`)
    }
  },
} as ICommand
