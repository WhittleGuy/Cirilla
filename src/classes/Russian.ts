import { CommandInteraction, CacheType, GuildMember } from 'discord.js'
import { FailureEmbed } from '../helpers'

export default class Revolver {
  CHAMBER: number[] | null
  SEXY_CHANCE: number = 100 // 1 out of X
  TIMEOUT_LENGTH: number = 1 // Seconds

  constructor() {
    this.CHAMBER = null
    this.spin()
  }

  async spin(): Promise<void> {
    this.CHAMBER = [0, 0, 0, 0, 0, 0]
    this.CHAMBER[Math.floor(Math.random() * (5 - 0 + 1))] = 1
  }

  async fire(interaction: CommandInteraction<CacheType>): Promise<void> {
    await interaction.deferReply({ ephemeral: false })
    const user = interaction.user
    const member = interaction.member as GuildMember

    // Kill condition
    if (this.CHAMBER.shift()) {
      await this.spin()
      await interaction
        .editReply({
          embeds: [
            {
              color: 0xff0000,
              author: { name: user.tag, iconURL: user.displayAvatarURL() },
              description: 'BANG!',
            },
          ],
        })
        .catch((err) => FailureEmbed(interaction, err))
      await member
        .timeout(this.TIMEOUT_LENGTH * 1000, 'Roulette')
        .catch((err) => FailureEmbed(interaction, err))
      return
    }

    // Survival condition
    else {
      const sexy = Math.floor(Math.random() * this.SEXY_CHANCE + 1)
      console.log(sexy, this.SEXY_CHANCE, this.CHAMBER)
      // Sexy chance
      if (sexy === this.SEXY_CHANCE) {
        await interaction
          .editReply({
            embeds: [
              {
                color: 0xff9ed7,
                author: { name: user.tag, iconURL: user.displayAvatarURL() },
                description:
                  'You are incredibly hot and sexy and everybody wants you.',
              },
            ],
          })
          .catch((err) => FailureEmbed(interaction, err))
        return
      }
      // Non-sexy surivival
      else {
        await interaction
          .editReply({
            embeds: [
              {
                color: 0x00ff00,
                author: { name: user.tag, iconURL: user.displayAvatarURL() },
                description: 'You have survived.',
              },
            ],
          })
          .catch((err) => FailureEmbed(interaction, err))
        return
      }
    }
  }
}
