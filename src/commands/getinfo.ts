import { ICommand } from 'wokcommands'

export default {
  category: 'Utility',
  description: 'Set/Enable/Disable an afk message',
  permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: true,
  guildOnly: false,
  options: [],

  callback: async ({ interaction }) => {
    interaction.reply({
      embeds: [
        {
          color: 0x00ff00,
          title: 'Title',
          description: 'Description',
          footer: { text: 'yeet' },
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 3,
              customId: 'select-menu',
              options: [
                {
                  label: 'Option 1',
                  value: 'option one',
                },
                {
                  label: 'Option 2',
                  value: 'option two',
                },
                {
                  label: 'Option 3',
                  value: 'option three',
                },
                {
                  label: 'Option 4',
                  value: 'option four',
                },
              ],
            },
          ],
        },
        {
          type: 1,
          components: [
            {
              type: 2,
              label: 'Button One',
              style: 3,
              customId: 'button-one',
            },
            {
              type: 2,
              label: 'Button Two',
              style: 3,
              customId: 'button-two',
            },
            {
              type: 2,
              label: 'Button Three',
              style: 3,
              customId: 'button-three',
            },
            {
              type: 2,
              label: 'Button Four',
              style: 4,
              customId: 'button-four',
            },
            {
              type: 2,
              label: 'Button Five',
              style: 4,
              customId: 'button-nine',
            },
          ],
        },
        {
          type: 1,
          components: [
            {
              type: 2,
              label: 'Button One',
              style: 3,
              customId: 'button-five',
            },
            {
              type: 2,
              label: 'Button Two',
              style: 3,
              customId: 'button-six',
            },
            {
              type: 2,
              label: 'Button Three',
              style: 3,
              customId: 'button-seven',
            },
            {
              type: 2,
              label: 'Button Four',
              style: 4,
              customId: 'button-eight',
            },
          ],
        },
      ],
    })
  },
} as ICommand
