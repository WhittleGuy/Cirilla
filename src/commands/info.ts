import { GuildMember, Role, User } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
  category: 'Information',
  description: 'Get information about a user or the server',
  // permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'Get user information',
      type: 1,
      options: [
        {
          name: 'user',
          description: 'Target user',
          type: 6,
          required: false,
        },
      ],
    },
    {
      name: 'server',
      description: 'Get server information',
      type: 1,
    },
  ],

  callback: ({ interaction }) => {
    if (interaction.options.getSubcommand() === 'user') {
      // User info
      const member = (interaction.options.getMember('user') ||
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
    } else if (interaction.options.getSubcommand() === 'server') {
      const guild = interaction.guild
      return interaction.reply({
        embeds: [
          {
            color: 0xffee8f,
            title: guild.name,
            thumbnail: { url: guild.iconURL() },
            fields: [
              {
                name: 'Created',
                value:
                  new Date(guild.createdTimestamp).toLocaleDateString() +
                  '\n' +
                  new Date(guild.createdTimestamp).toLocaleTimeString(),
                inline: true,
              },
              {
                name: 'Owner',
                value: guild.members.cache.get(guild.ownerId).user.tag,
                inline: true,
              },
              {
                name: 'Members',
                value: `${guild.memberCount}`,
                inline: true,
              },
              {
                name: 'Emotes',
                value: `${guild.emojis.cache.size}`,
                inline: true,
              },
            ],
          },
        ],
      })
    }
  },
} as ICommand
