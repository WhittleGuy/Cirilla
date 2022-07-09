import { GuildMember } from 'discord.js'
import { ICommand } from 'wokcommands'
import { ColorCheck, SendError } from '../../helpers'
import revolverSchema from '../../models/revolver-schema'

const revolverData = {} as {
  // guildId: number[]
  [key: string]: number[]
}

const spin = (): number[] => {
  const chamber = [0, 0, 0, 0, 0, 0]
  chamber[Math.floor(Math.random() * (5 - 0 + 1))] = 1
  return chamber
}

const timeoutLength = 3
const sexyChance = 100

export default {
  category: 'Fun',
  description: 'Play russian roulette',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,

  callback: async ({ guild, interaction }) => {
    await interaction.deferReply()
    const member = interaction.member as GuildMember
    const user = interaction.user

    // Get data if present, reset revolver if not
    let data = revolverData[guild.id]
    if (!data) {
      try {
        const res = await revolverSchema.findById(guild.id)
        if (res) {
          const { chambers } = res
          data = chambers
        } else {
          data = spin()
        }
      } catch (err) {
        SendError('russianRoulette.ts', guild, member, err)
      }
    }
    // Prepare response to be edited accordingly
    const responseEmbed = {
      color: ColorCheck('REMOVE'),
      //author: { name: user.tag, iconURL: user.displayAvatarURL() },
      title: `${''}`,
      description: `${''}`,
      footer: { text: user.tag, icon_url: user.displayAvatarURL() },
      timestamp: new Date(),
    }

    // Fire round (get result)
    const bullet = data.shift()

    // Send new chambers to revolverData and db
    // Check that data has a 'bullet' and is not empty
    if (!data.includes(1) || !data.length) {
      data = spin()
    }
    revolverData[guild.id] = data
    try {
      await revolverSchema.findOneAndUpdate(
        {
          _id: guild.id,
        },
        {
          _id: guild.id,
          chambers: data,
        },
        {
          upsert: true,
        }
      )
    } catch (err) {
      SendError('russianRoulette.ts', guild, member, err)
    }

    //  Kill condition
    if (bullet) {
      responseEmbed.color = ColorCheck('REMOVE')
      responseEmbed.title = 'Bang!'
      responseEmbed.description = `**Timed out for ${timeoutLength} minute(s)**`
      try {
        await member
          .timeout(timeoutLength * 60000, '/russianroulette')
          .catch(() => {
            responseEmbed.description = `${''}`
            return
          })
      } catch (err) {
        SendError('russianRoulette.ts', guild, member, err)
      }
      try {
        await interaction.editReply({ embeds: [responseEmbed] })
      } catch (err) {
        SendError('russianRoulette.ts', guild, member, err)
      }
    }

    // Survival condition
    else {
      const sexy = Math.floor(Math.random() * sexyChance + 1)
      // Sexy response
      if (sexy === sexyChance) {
        responseEmbed.color = ColorCheck()
        responseEmbed.description =
          '**<a:zdripheart:901385907859501056> You are incredibly hot and sexy and everybody wants you <a:zdripheart:901385907859501056>**'
        try {
          await interaction.editReply({ embeds: [responseEmbed] })
        } catch (err) {
          SendError('russianRoulette.ts', guild, member, err)
        }
      } else {
        responseEmbed.color = ColorCheck('ADD')
        responseEmbed.title = '**You have survived**'
        try {
          await interaction.editReply({ embeds: [responseEmbed] })
        } catch (err) {
          SendError('russianRoulette.ts', guild, member, err)
        }
      }
    }

    return
  },
} as ICommand
