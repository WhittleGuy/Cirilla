import { ICommand } from 'wokcommands'
import { RULES } from '../../constants/RULES'
import { ColorCheck, FailureMessage } from '../../helpers'

interface RULE_CATEGORY {
  name: string
  rules: string[]
}

export default {
  category: 'Information',
  description: 'Display server rules',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: false,
  options: [
    {
      name: 'show',
      description: 'Display response for all users',
      type: 5,
      required: false,
    },
  ],

  callback: ({ interaction }) => {
    const show = interaction.options.getBoolean('show')
    const categories = []
    const sortedRules: RULE_CATEGORY[] = []

    for (const rule of RULES) {
      if (!categories.includes(rule.category)) {
        categories.push(rule.category)
        sortedRules.push({
          name: rule.category,
          rules: [],
        })
      }
      sortedRules[categories.indexOf(rule.category)].rules.push(
        rule.description
      )
    }

    const rulesEmbedFields: Object[] = []
    for (const category of sortedRules) {
      rulesEmbedFields.push({
        name: category.name,
        value: '- ' + category.rules.join('\n- '),
      })
    }
    interaction
      .reply({
        embeds: [
          {
            color: ColorCheck(),
            title: 'Rules', //@ts-ignore
            fields: [rulesEmbedFields],
          },
        ],
        ephemeral: !show,
      })
      .catch((err) => {
        return FailureMessage(interaction, err)
      })
  },
} as ICommand
