import { ICommand } from 'wokcommands'
import { FailureEmbed } from '../helpers'

export default {
  category: 'Utility',
  description: 'Get a list of tone indicator meanings',
  slash: true,
  testOnly: true,
  syntax: '[command]',
  options: [
    {
      name: 'commands',
      description: 'The command you want more information about',
      type: 3,
      required: false,
    },
  ],

  callback: ({ interaction, instance }) => {
    const command = interaction.options.getString('command')
    if (command) {
      const match = instance.commandHandler.commands.filter(
        (cmd) => cmd.names[0] === command
      )[0]
      if (!match) {
        return FailureEmbed(interaction, `Command "${command}" not found`)
      }

      const commandEmbed = {
        color: 0xff9ed7,
        title: match.names[0],
        description: `Description: ${match.description}\nSyntax: ${match.syntax}`,
      }
      return interaction.reply({ embeds: [commandEmbed] })
    }

    const utilCommands: string[] = []
    const modCommands: string[] = []

    instance.commandHandler.commands.map((command) => {
      if (command.category.includes('Utility')) {
        utilCommands.push(command.names[0])
      }
      if (command.category.includes('Moderation')) {
        modCommands.push(command.names[0])
      }
    })
    const commandEmbed = {
      color: 0xff9ed7,
      title: 'Cirilla Commands',
      fields: [
        {
          name: 'Utility',
          value: '```YAML\n-' + utilCommands.join('\n-') + '\n```',
          inline: true,
        },
        {
          name: 'Moderation',
          value: '```YAML\n-' + modCommands.join('\n-') + '\n```',
          inline: true,
        },
      ],
      footer: {
        text: 'Use `/help <command>` for a description',
      },
    }
    return interaction.reply({ embeds: [commandEmbed] })
  },
} as ICommand
