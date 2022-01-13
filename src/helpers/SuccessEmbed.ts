import {
  CommandInteraction,
  CacheType,
  SelectMenuInteraction,
} from 'discord.js'

const SuccessEmbed = (
  interaction: CommandInteraction<CacheType> | SelectMenuInteraction<CacheType>,
  msg?: string,
  show?: boolean
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
    interaction.reply({ embeds: [successEmbed], ephemeral: !show })
  }
  return
}

export default SuccessEmbed
