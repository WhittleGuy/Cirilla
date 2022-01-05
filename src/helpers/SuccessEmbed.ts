import { CommandInteraction, CacheType } from 'discord.js'

const SuccessEmbed = (
  interaction: CommandInteraction<CacheType>,
  msg?: string
): void => {
  const successEmbed = {
    color: 0x00ff00,
    description: `${msg ? msg : 'Success'}`,
  }

  if (interaction.replied || interaction.deferred) {
    //console.log('Try editReply')
    interaction.editReply({ embeds: [successEmbed] })
  } else {
    //console.log('Try reply')
    interaction.reply({ embeds: [successEmbed], ephemeral: true })
  }
  return
}

export default SuccessEmbed
