import { ICommand } from 'wokcommands'
import { ColorCheck, FailureEmbed } from '../../helpers'

interface COMMAND_CATEGORY {
  name: string
  commands: string[]
}

export default {
  category: 'Information',
  description: 'List Cirilla commands',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'command',
      description: 'Specific command',
      type: 3,
      required: false,
    },
    {
      name: 'show',
      description: 'Display response for all users',
      type: 5,
      required: false,
    },
  ],

  callback: async ({ interaction, instance, client }) => {
    const command = interaction.options.getString('command')
    const show = interaction.options.getBoolean('show') || false
    await interaction.deferReply({ ephemeral: !show })

    // Singular command
    const commandList = instance.commandHandler.commands
    if (command) {
      const match = commandList.filter((cmd) => cmd.names[0] === command)[0]
      if (!match) {
        return FailureEmbed(interaction, `Command "${command}" not found`)
      }
      await interaction.editReply({
        embeds: [
          {
            color: ColorCheck(),
            title: match.names[0],
            description: `Description: ${match.description}`,
          },
        ],
      })
      return
    }

    // Full list
    else {
      const categories = []
      const sortedCommands: COMMAND_CATEGORY[] = []

      // Get categories and
      for (const command of commandList) {
        const { category } = command
        if (!['Configuration', 'Help'].includes(category)) {
          if (!categories.includes(category)) {
            categories.push(category)
            sortedCommands.push({
              name: category,
              commands: [],
            })
          }
          sortedCommands[categories.indexOf(category)].commands.push(
            command.names[0]
          )
        }
      }

      const commandEmbedFields: Object[] = []
      for (const category of sortedCommands) {
        commandEmbedFields.push({
          name: category.name,
          value: `\`\`\`\n-${category.commands.join('\n-')}\n\`\`\``,
          inline: true,
        })
      }
      interaction.editReply({
        embeds: [
          {
            color: ColorCheck(),
            title: 'Cirilla Commands',
            thumbnail: { url: client.user.displayAvatarURL() },
            timestamp: new Date(),
            footer: {
              text: interaction.user.id,
            },
            //@ts-ignore
            fields: [commandEmbedFields],
          },
        ],
      })
    }
  },
} as ICommand
