import {
  ColorResolvable,
  GuildMember,
  MessageEmbed,
  Role,
  User,
} from 'discord.js'
import { ICommand } from 'wokcommands'
import { ColorCheck } from '../helpers/ColorCheck'

export default {
  category: 'Information',
  description: 'Get user or server information',
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
          description: 'User to search',
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
            color: ColorCheck().valueOf() as number,
            title: user.tag,
            thumbnail: { url: user.displayAvatarURL() },
            footer: { text: `Id: ${user.id}` },
            timestamp: new Date().toLocaleString(),
            fields: [
              {
                name: 'Joined',
                value: new Date(member.joinedTimestamp).toLocaleString(),
                inline: true,
              },
              {
                name: 'Registered',
                value: new Date(user.createdTimestamp).toLocaleString(),
                inline: true,
              },
              {
                name: 'Nickname',
                value: member.nickname || 'None',
                inline: true,
              },
              {
                name: 'Bot',
                value: user.bot ? 'Yes' : 'No',
                inline: true,
              },
              {
                name: `Roles [${member.roles.cache.size - 1}]`,
                value: member.roles.cache
                  .map((role: Role) => role)
                  .slice(0, -1)
                  .join(' '),
                inline: false,
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
            color: ColorCheck(),
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
                value: guild.members.cache.get(guild.ownerId)?.user.tag,
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
