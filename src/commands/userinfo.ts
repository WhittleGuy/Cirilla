import { GuildMember, Role } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
  category: 'Utility',
  description: 'Get information about yourself or another user',
  slash: true,
  testOnly: true,
  syntax: '[user]',
  options: [
    {
      name: 'user',
      description: 'The user you want information about',
      type: 6,
      required: false,
    },
  ],

  callback: ({ interaction }) => {
    let member = (interaction.options.getMember('user') ||
      interaction.member) as GuildMember
    const user = member.user

    return interaction.reply({
      embeds: [
        {
          color: 0xffee8f,
          title: user.tag,
          thumbnail: { url: user.displayAvatarURL() },
          fields: [
            {
              name: 'Bot',
              value: user.bot ? 'Yes' : 'No',
              inline: true,
            },
            {
              name: 'Nickname',
              value: member.nickname || 'None',
              inline: true,
            },
            {
              name: 'Roles',
              value: member.roles.cache
                .map((role: Role) => role)
                .slice(0, -1)
                .join(' '),
              inline: true,
            },
            {
              name: 'Joined Server',
              value:
                new Date(member.joinedTimestamp).toLocaleDateString() +
                '\n' +
                new Date(member.joinedTimestamp).toLocaleTimeString(),
              inline: true,
            },
            {
              name: 'Joined Discord',
              value:
                new Date(user.createdTimestamp).toLocaleDateString() +
                '\n' +
                new Date(user.createdTimestamp).toLocaleTimeString(),
              inline: true,
            },
          ],
        },
      ],
    })
  },
} as ICommand
