import { ICommand } from 'wokcommands'
import { FailureEmbed } from '../helpers'

interface COMMAND_CATEGORY {
  name: string
  commands: string[]
}

export default {
  category: 'Information',
  description: 'Get a list of commands',
  slash: true,
  testOnly: false,
  options: [
    {
      name: 'command',
      description: 'The command you want more information about',
      type: 3,
      required: false,
    },
    {
      name: 'show',
      description:
        'True/False to display to everyone (defaults to just the user)',
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
            color: 0xff9ed7,
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
          value: `\`\`\`Yaml\n-${category.commands.join('\n-')}\n\`\`\``,
          inline: true,
        })
      }
      interaction.editReply({
        embeds: [
          {
            color: 0xff9ed7,
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
