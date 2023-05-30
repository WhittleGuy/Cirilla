import { ICommand } from 'wokcommands'
import { ColorCheck, FailureMessage } from '../../helpers'
import { MessageEmbed } from 'discord.js'

export default {
  category: 'Utility',
  description: 'Set a timer',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: false,
  options: [
    {
      name: 'duration',
      description: 'Duration for the timer to countdown (e.g. 10s, 1m, 2h)',
      type: 3,
      required: true,
    },
    {
      name: 'title',
      description: 'Title of the timer',
      type: 3,
      required: false,
    },
    {
      name: 'description',
      description: 'Description for the timer',
      type: 3,
      required: false,
    },
  ],

  callback: async ({ interaction }) => {
    await interaction.deferReply()
    const duration = interaction.options.getString('duration')
    const title = interaction.options.getString('title')
    const desc = interaction.options.getString('desc')

    const timeRegEx = /^(\d+[smhd]{1})$/

    if (!timeRegEx.test(duration)) {
      return FailureMessage(
        interaction,
        'Please use a valid duration, e.g. 1s, 2m, 3h, 1d'
      )
    }

    let time = Number(duration.slice(0, -1))
    if (time <= 0)
      return FailureMessage(interaction, 'Provide a valid duration')
    const timeUnit = duration.slice(-1)
    console.log(timeUnit)
    const totalDuration = time

    let prettyUnit = ''
    switch (timeUnit.toLowerCase()) {
      case 's':
        prettyUnit = time === 1 ? 'second' : 'seconds'
        break
      case 'm':
        prettyUnit = time === 1 ? 'minute' : 'minutes'
        break
      case 'h':
        prettyUnit = time === 1 ? 'hour' : 'hours'
        break
      case 'd':
        prettyUnit = time === 1 ? 'day' : 'days'
        break
    }

    if (timeUnit === 's') time *= 1
    else if (timeUnit === 'm') time *= 60
    else if (timeUnit === 'h') time *= 60 * 60
    else if (timeUnit === 'd') time *= 24 * 60 * 60

    const prettyTime = (time: number) => {
      const days = Math.floor(time / 86400)
      const hours = Math.floor((time - days * 86400) / 3600)
      const minutes = Math.floor((time - days * 86400 - hours * 3600) / 60)
      const seconds = Math.floor(
        time - days * 86400 - hours * 3600 - minutes * 60
      )

      return `\
            ${days > 0 ? days + ':' : ''}${
        hours > 0 || days !== 0
          ? hours < 10
            ? '0' + hours + ':'
            : hours + ':'
          : ''
      }${
        minutes > 0 || hours !== 0 || days !== 0
          ? minutes < 10 && (days !== 0 || hours !== 0)
            ? '0' + minutes + ':'
            : minutes + ':'
          : ''
      }${
        seconds < 10 && (minutes !== 0 || hours !== 0 || days !== 0)
          ? '0' + seconds + 's'
          : seconds + 's'
      }`
    }

    try {
      await interaction.editReply({
        embeds: [
          {
            color: ColorCheck(),
            title: `${title ? title : ''}`,
            description: `${desc ? desc : ''}`,
            // footer: { text: interaction.user.id },
            timestamp: new Date(),
            fields: [
              {
                name: 'Duration',
                value: `${totalDuration} ${prettyUnit}`,
                inline: true,
              },
              {
                name: 'Remaining',
                value: prettyTime(time),
                inline: true,
              },
            ],
          },
        ],
      })
    } catch {
      return FailureMessage(interaction)
    }

    const interval = setInterval(async () => {
      time -= 1
      if (time > 0) {
        try {
          await interaction.editReply({
            embeds: [
              {
                color: ColorCheck(),
                title: `${title ? title : ''}`,
                description: `${desc ? desc : ''}`,
                // footer: { text: interaction.user.id },
                timestamp: new Date(),
                fields: [
                  {
                    name: 'Duration',
                    value: `${totalDuration} ${prettyUnit}`,
                    inline: true,
                  },
                  {
                    name: 'Remaining',
                    value: prettyTime(time),
                    inline: true,
                  },
                ],
              },
            ],
          })
        } catch {
          return await FailureMessage(interaction)
        }
      }
      if (time === 0) {
        clearInterval(interval)
        try {
          await interaction.editReply({
            embeds: [
              {
                color: ColorCheck('REMOVE'),
                title: `${title ? title + ' | FINISHED' : 'FINISHED'}`,
                description: `${desc ? desc : ''}`,
                // footer: { text: interaction.user.id },
                timestamp: new Date(),
                fields: [
                  {
                    name: 'Duration',
                    value: `${totalDuration} ${prettyUnit}`,
                    inline: true,
                  },
                  {
                    name: 'Remaining',
                    value: prettyTime(time),
                    inline: true,
                  },
                ],
              },
            ],
          })
        } catch {
          return FailureMessage(interaction)
        }
      }
    }, 1000)
  },
} as ICommand
