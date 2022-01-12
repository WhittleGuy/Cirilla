import { Client, Guild, Role } from 'discord.js'
import { ICommand } from 'wokcommands'
import { ColorCheck, FailureMessage, SuccessMessage } from '../../helpers'
import loggingSchema from '../../models/loggingSchema'

const loggingData = {} as {
  // guildId: [channel, enabled, ...options]
  [key: string]: [
    string,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean
  ]
}

export default {
  category: 'Configuration',
  description: 'Set up server-wide logging',
  permissions: ['ADMINISTRATOR'],
  requireRoles: false,
  slash: true,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'channel',
      description: 'The channel to send log messages to',
      type: 7,
      required: true,
    },
    {
      name: 'enable',
      description: 'Turn logging module on or off',
      type: 5,
      required: false,
    },
    {
      name: 'invite-create',
      description: 'Log invite creation',
      type: 5,
      required: false,
    },
    {
      name: 'invite-delete',
      description: 'Log invite deletion',
      type: 5,
      required: false,
    },
    {
      name: 'message-delete',
      description: 'Log deleted messages',
      type: 5,
      required: false,
    },
    {
      name: 'message-delete-bulk',
      description: 'Log bulk message deletion',
      type: 5,
      required: false,
    },
    {
      name: 'message-update',
      description: 'Log message edits',
      type: 5,
      required: false,
    },
    {
      name: 'role-create',
      description: 'Log role creation',
      type: 5,
      required: false,
    },
    {
      name: 'role-delete',
      description: 'Log role deletion',
      type: 5,
      required: false,
    },
    {
      name: 'role-update',
      description: 'Log role updates (changes to role, not member add/remove)',
      type: 5,
      required: false,
    },
    {
      name: 'thread-create',
      description: 'Log thread creation',
      type: 5,
      required: false,
    },
    {
      name: 'thread-delete',
      description: 'Log thread deletion',
      type: 5,
      required: false,
    },
    {
      name: 'thread-update',
      description: 'Log thread updates',
      type: 5,
      required: false,
    },
    {
      name: 'voice-update',
      description: 'Log when a user joins/leaves/changes voice channels',
      type: 5,
      required: false,
    },
    {
      name: 'member-roles',
      description: 'Log when a user adds/removes a role',
      type: 5,
      required: false,
    },
    {
      name: 'nickname-change',
      description: 'Log when a user changes their nickname',
      type: 5,
      required: false,
    },
    {
      name: 'leaves',
      description: 'Log when members leave the server',
      type: 5,
      required: false,
    },
    {
      name: 'joins',
      description: 'Log when members join the server',
      type: 5,
      required: false,
    },
    {
      name: 'bans',
      description: 'Log when a member is banned',
      type: 5,
      required: false,
    },
    {
      name: 'unban',
      description: 'Log when a member is unbanned ',
      type: 5,
      required: false,
    },
  ],

  init: async (client: Client) => {
    // Refresh guild data on load

    const results = await loggingSchema.find()
    if (!results) return

    for (const res of results) {
      const {
        logChannel,
        enabled,
        inviteCreate,
        inviteDelete,
        msgDelete,
        msgBulkDelete,
        msgUpdate,
        roleCreate,
        roleDelete,
        roleUpdate,
        threadCreate,
        threadDelete,
        threadUpdate,
        voiceUpdate,
        memberRoleUpdate,
        memberNickUpdate,
        memberRemove,
        memberAdd,
        banAdd,
        banRemove,
      } = res
      loggingData[res._id] = [
        logChannel,
        enabled,
        inviteCreate,
        inviteDelete,
        msgDelete,
        msgBulkDelete,
        msgUpdate,
        roleCreate,
        roleDelete,
        roleUpdate,
        threadCreate,
        threadDelete,
        threadUpdate,
        voiceUpdate,
        memberRoleUpdate,
        memberNickUpdate,
        memberRemove,
        memberAdd,
        banAdd,
        banRemove,
      ]
    }

    // Invite creation
    client.on('inviteCreate', async (inv) => {
      const data = loggingData[inv.guild.id]
      if (!(data[1] && data[2])) return
      else {
        const guild = inv.guild as Guild
        const logChannel = await guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel.send({
          embeds: [
            {
              color: 0x00ff00,
              title: `Invite Created`,
              author: {
                name: inv.inviter.tag,
                icon_url: inv.inviter.displayAvatarURL(),
              },
              footer: { text: `Creator: ${inv.inviter.id}` },
              timestamp: new Date(),
              fields: [
                {
                  name: 'Channel',
                  value: '#' + inv.channel.name,
                  inline: true,
                },

                {
                  name: 'Max Uses',
                  value: inv.maxUses.toString(),
                  inline: true,
                },
                {
                  name: 'Target User',
                  value: inv.targetUser?.tag || 'None',
                  inline: true,
                },
                {
                  name: 'Expires',
                  value: inv.expiresAt.toLocaleString(),
                  inline: true,
                },
                {
                  name: 'Id',
                  value: inv.code,
                  inline: true,
                },
              ],
            },
          ],
        })
      }
      return
    })

    // Invite deletion
    client.on('inviteDelete', async (inv) => {
      const data = loggingData[inv.guild.id]
      if (!(data[1] && data[3])) return
      else {
        const guild = inv.guild as Guild
        const logChannel = await guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel.send({
          embeds: [
            {
              color: 0xff0000,
              title: `Invite Deleted`,
              author: {
                name: guild.name,
                icon_url: guild.iconURL(),
              },
              timestamp: new Date(),
              fields: [
                {
                  name: 'Channel',
                  value: inv.channel.name,
                  inline: true,
                },

                {
                  name: 'Id',
                  value: inv.code,
                  inline: true,
                },
              ],
            },
          ],
        })
      }
      return
    })
    // Message Deletion
    client.on('messageDelete', async (msg) => {
      const data = loggingData[msg.guild.id]
      if (!(data[1] && data[4])) return
      else {
        const guild = msg.guild as Guild
        const logChannel = await guild.channels.fetch(data[0])
        if (msg.author.bot) return
        if (logChannel.type !== 'GUILD_TEXT') return
        const msgChannel = msg.guild.channels.cache.get(msg.channel.id)
        await logChannel.send({
          embeds: [
            {
              color: 0xff0000,
              title: `Message Deleted in #${msgChannel.name}`,
              author: {
                name: msg.member.user.tag,
                icon_url: msg.member.user.displayAvatarURL(),
              },
              footer: { text: `Author: ${msg.member.user.id}` },
              timestamp: new Date(),
              description: `${msg?.content}`,
            },
          ],
        })
      }
      return
    })
    // Message Bulk Delete
    client.on('messageDeleteBulk', async (msgs) => {
      const data = loggingData[msgs.first().guild.id]
      if (!(data[1] && data[5])) return
      else {
        const guild = msgs.first().guild as Guild
        const logChannel = await guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        const msgChannel = guild.channels.cache.get(msgs.first().channel.id)
        await logChannel.send({
          embeds: [
            {
              color: 0xff0000,
              title: 'Bulk Delete',
              author: {
                name: guild.name,
                icon_url: guild.iconURL(),
              },

              timestamp: new Date(),
              description: `${msgs.size} messages deleted in #${msgChannel.name}`,
            },
          ],
        })
      }
      return
    })
    // Message update
    client.on('messageUpdate', async (oldMsg, newMsg) => {
      if (oldMsg.type === 'THREAD_CREATED') return
      if (oldMsg.author.bot) return
      const data = loggingData[oldMsg.guild.id]
      const { guild } = oldMsg
      if (!(data[1] && data[6])) return
      else {
        const logChannel = await guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        const msgChannel = guild.channels.cache.get(oldMsg.channel.id)
        await logChannel.send({
          embeds: [
            {
              color: ColorCheck(),
              title: `**Message edited in** #${msgChannel.name}`,
              author: {
                name: oldMsg.member.user.tag,
                icon_url: oldMsg.member.user.displayAvatarURL(),
              },
              footer: { text: 'userId: ' + oldMsg.author.id },
              timestamp: new Date(),
              description: `**Before**\n${oldMsg?.content}\n\n**After**\n${newMsg?.content}`,
            },
          ],
        })
      }
      return
    })
    // Role create
    client.on('roleCreate', async (role) => {
      const data = loggingData[role.guild.id]
      if (!(data[1] && data[7])) return
      else {
        const logChannel = await role.guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel.send({
          embeds: [
            {
              color: 0x00ff00,
              title: 'Role Created',
              author: {
                name: role.guild.name,
                icon_url: role.guild.iconURL(),
              },
              thumbnail: { url: role.iconURL() },
              timestamp: new Date(),
              fields: [
                {
                  name: 'Name',
                  value: role.name,
                  inline: true,
                },
                {
                  name: 'Color',
                  value: role.hexColor,
                  inline: true,
                },
                {
                  name: 'Position',
                  value: role.position.toString(),
                  inline: true,
                },
                {
                  name: 'Permissions',
                  value: role.permissions.toArray().join(', '),
                  inline: false,
                },
              ],
            },
          ],
        })
      }
      return
    })
    // Role delete
    client.on('roleDelete', async (role) => {
      const data = loggingData[role.guild.id]
      if (!(data[1] && data[8])) return
      else {
        const logChannel = await role.guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel.send({
          embeds: [
            {
              color: 0xff0000,
              title: 'Role Deleted',
              author: {
                name: role.guild.name,
                icon_url: role.guild.iconURL(),
              },
              thumbnail: { url: role.iconURL() },
              timestamp: new Date(),
              fields: [
                {
                  name: 'Name',
                  value: role.name || 'None',
                  inline: true,
                },
                {
                  name: 'Color',
                  value: role.hexColor || 'None',
                  inline: true,
                },
                {
                  name: 'Position',
                  value: role.position.toString() || 'None',
                  inline: true,
                },
                {
                  name: 'Permissions',
                  value: role.permissions.toArray().join(', ') || 'None',
                  inline: false,
                },
              ],
            },
          ],
        })
      }
      return
    })
    // Role update
    client.on('roleUpdate', async (oldRole, newRole) => {
      // const data = loggingData[oldRole.guild.id]
      // if (!(data[1] && data[9])) return
      // else {
      //   const logChannel = await oldRole.guild.channels.fetch(data[0])
      //   if (logChannel.type !== 'GUILD_TEXT') return
      //   await logChannel.send({
      //     embeds: [
      //       {
      //         color: ColorCheck(),
      //         title: 'Role Updated',
      //         author: {
      //           name: oldRole.guild.name,
      //           icon_url: oldRole.guild.iconURL(),
      //         },
      //         thumbnail: { url: newRole.iconURL() },
      //         timestamp: new Date(),
      //         description: `**Before**\n\
      //         Name: ${oldRole.name}\n\
      //         Color: ${oldRole.hexColor}\n\
      //         Position: ${oldRole.position}\n\
      //         Permissions: ${oldRole.permissions.toArray().join(', ')}\n\n\
      //         **After**\n\
      //         Name: ${newRole.name}\n\
      //         Color: ${newRole.hexColor}\n\
      //         Position: ${newRole.position}\n\
      //         Permissions: ${newRole.permissions.toArray().join(', ')}`,
      //       },
      //     ],
      //   })
      // }
      return
    })
    // Thread create
    client.on('threadCreate', async (thread) => {
      const data = loggingData[thread.guild.id]
      if (!(data[1] && data[10])) return
      else {
        const logChannel = await thread.guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel.send({
          embeds: [
            {
              color: 0x00ff00,
              title: 'Thread Created',
              author: {
                name: thread.guild.name,
                icon_url: thread.guild.iconURL(),
              },
              timestamp: new Date(),
              fields: [
                {
                  name: 'Name',
                  value: thread.name || 'None',
                  inline: true,
                },
                {
                  name: 'Parent',
                  value: '#' + thread.parent.name || 'None',
                  inline: true,
                },
                {
                  name: 'Owner',
                  value: (await thread.fetchOwner()).user.tag || 'None',
                  inline: true,
                },
                {
                  name: 'Message',
                  value: thread.messages.cache.first()?.content || 'None',
                  inline: false,
                },
              ],
            },
          ],
        })
      }
      return
    })
    // Thread delete
    client.on('threadDelete', async (thread) => {
      const data = loggingData[thread.guild.id]
      if (!(data[1] && data[11])) return
      else {
        const logChannel = await thread.guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel.send({
          embeds: [
            {
              color: 0xff0000,
              title: 'Thread Deleted',
              author: {
                name: thread.guild.name,
                icon_url: thread.guild.iconURL(),
              },
              timestamp: new Date(),
              fields: [
                {
                  name: 'Name',
                  value: thread.name || 'None',
                  inline: true,
                },
                {
                  name: 'Parent',
                  value: '#' + thread.parent.name || 'None',
                  inline: true,
                },
              ],
            },
          ],
        })
      }
      return
    })
    // Thread update
    client.on('threadUpdate', async (oldThread, newThread) => {
      const data = loggingData[oldThread.guild.id]
      if (!(data[1] && data[12])) return
      else {
        const logChannel = await oldThread.guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel.send({
          embeds: [
            {
              color: ColorCheck(),
              title: 'Thread Updated',
              author: {
                name: oldThread.guild.name,
                icon_url: oldThread.guild.iconURL(),
              },
              timestamp: new Date(),
              description: `Name: ${newThread.name}
              Parent: #${newThread.parent.name}
              Archive After: ${
                parseInt(
                  newThread.autoArchiveDuration
                    .toLocaleString()
                    .replace(',', '')
                ) / 60
              } hour(s)
              RateLimit: ${newThread.rateLimitPerUser.toString()}s`,
            },
          ],
        })
      }
      return
    })
    // Voice status update
    client.on('voiceStateUpdate', async (oldState, newState) => {
      const data = loggingData[oldState.guild.id]
      if (!(data[1] && data[13])) return
      const logChannel = await oldState.guild.channels.fetch(data[0])
      if (logChannel.type !== 'GUILD_TEXT') return
      else {
        // channel shift
        if (oldState.channel !== newState.channel) {
          if (oldState.channel === null) {
            await logChannel.send({
              embeds: [
                {
                  title: 'User Joined Voice Channel',
                  color: 0x00ff00,
                  author: {
                    name: oldState.member.user.tag,
                    icon_url: oldState.member.user.displayAvatarURL(),
                  },
                  description: newState.channel.name,
                },
              ],
            })
          } else if (newState.channel === null) {
            await logChannel.send({
              embeds: [
                {
                  title: 'User Left Voice Channel',
                  color: 0xff0000,
                  author: {
                    name: oldState.member.user.tag,
                    icon_url: oldState.member.user.displayAvatarURL(),
                  },
                  description: oldState.channel.name,
                },
              ],
            })
          } else {
            await logChannel.send({
              embeds: [
                {
                  title: 'User Switched Voice Channels',
                  color: ColorCheck(),
                  author: {
                    name: oldState.member.user.tag,
                    icon_url: oldState.member.user.displayAvatarURL(),
                  },
                  fields: [
                    {
                      name: 'Before',
                      value: oldState.channel.name,
                      inline: true,
                    },
                    {
                      name: 'After',
                      value: newState.channel.name,
                      inline: true,
                    },
                  ],
                },
              ],
            })
          }
        }
      }

      return
    })
    // Member nickname change & role update
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
      const data = loggingData[oldMember.guild.id]
      if (
        data[1] &&
        data[14] &&
        oldMember.roles.cache.size !== newMember.roles.cache.size
      ) {
        // Role change
        const logChannel = await oldMember.guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        let roleGiven
        if (newMember.roles.cache.size > oldMember.roles.cache.size) {
          roleGiven = true
        } else {
          roleGiven = false
        }
        const changeRole = roleGiven
          ? newMember.roles.cache
              .filter((r) => !oldMember.roles.cache.has(r.id))
              .first()
          : oldMember.roles.cache
              .filter((r) => !newMember.roles.cache.has(r.id))
              .first()
        await logChannel.send({
          embeds: [
            {
              title: `Member Role Update`,
              color: ColorCheck(),
              thumbnail: { url: oldMember.user.displayAvatarURL() },
              description: `${
                roleGiven
                  ? oldMember.user.tag +
                    ' was given the ' +
                    changeRole.name +
                    ' role'
                  : changeRole.name + ' role removed from ' + oldMember.user.tag
              }`,
              footer: {
                text: `Id: ${newMember.id}`,
              },
              timestamp: new Date(),
            },
          ],
        })
      } else if (
        data[1] &&
        data[15] &&
        oldMember.nickname !== newMember.nickname
      ) {
        // Nick Change
        const logChannel = await oldMember.guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel.send({
          embeds: [
            {
              title: `Nickname Changed`,
              color: ColorCheck(),
              thumbnail: { url: oldMember.user.displayAvatarURL() },
              description: `**Before**
              ${oldMember.nickname || 'None'}\n
              **After**
              ${newMember.nickname || 'None'}`,
              footer: {
                text: `Id: ${newMember.id}`,
              },
              timestamp: new Date(),
            },
          ],
        })
      }
      return
    })
    // Guild member remove
    client.on('guildMemberRemove', async (member) => {
      const data = loggingData[member.guild.id]
      if (!(data[1] && data[16])) return
      else {
        const logChannel = await member.guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel.send({
          embeds: [
            {
              title: `${member.user.tag} left the server`,
              color: 0xff0000,
              thumbnail: { url: member.user.displayAvatarURL() },
              fields: [
                {
                  name: 'Bot',
                  value: member.user.bot ? 'True' : 'False',
                  inline: true,
                },
                {
                  name: 'Joined',
                  value:
                    new Date(member.joinedAt).toLocaleDateString() +
                    '\n' +
                    new Date(member.joinedAt).toLocaleTimeString(),
                  inline: true,
                },
                {
                  name: 'Time in Server',
                  value: `${(
                    (new Date().getTime() -
                      new Date(member.joinedAt).getTime()) /
                    (1000 * 3600 * 24)
                  ).toFixed(2)} days`,
                  inline: true,
                },
                {
                  name: 'Roles',
                  value:
                    member.roles.cache
                      .map((role: Role) => role)
                      .slice(0, -1)
                      .join(' ') || 'None',
                  inline: true,
                },
              ],
              footer: {
                text: `Id: ${member.id}`,
              },
              timestamp: new Date(),
            },
          ],
        })
      }
      return
    })
    // Guild member add
    client.on('guildMemberAdd', async (member) => {
      const data = loggingData[member.guild.id]
      if (!(data[1] && data[17])) return
      else {
        const logChannel = await member.guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        const { guild } = member
        await logChannel.send({
          embeds: [
            {
              title: `${member.user.tag} joined the server`,
              color: 0x00ff00,
              thumbnail: { url: member.user.displayAvatarURL() },
              author: {
                name: guild.name,
                icon_url: guild.iconURL(),
              },
              fields: [
                {
                  name: 'Bot',
                  value: member.user.bot ? 'True' : 'False',
                  inline: false,
                },
                {
                  name: 'Account Created',
                  value: member.user.createdAt.toLocaleString(),
                  inline: false,
                },
              ],
              footer: {
                text: `Id: ${member.id}`,
              },
              timestamp: new Date(),
            },
          ],
        })
      }

      return
    })
    // Guild ban add
    client.on('guildBanAdd', async (ban) => {
      const data = loggingData[ban.guild.id]
      if (!(data[1] && data[18])) return
      else {
        const logChannel = await ban.guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel.send({
          embeds: [
            {
              title: `${ban.user.tag} has been banned`,
              color: 0xff0000,
              thumbnail: { url: ban.user.displayAvatarURL() },
              author: {
                name: ban.guild.name,
                icon_url: ban.guild.iconURL(),
              },
              fields: [
                {
                  name: 'Account Created',
                  value: ban.user.createdAt.toLocaleString(),
                  inline: false,
                },
                {
                  name: 'Reason',
                  value: ban.reason,
                  inline: false,
                },
              ],
              footer: {
                text: `Id: ${ban.user.id}`,
              },
              timestamp: new Date(),
            },
          ],
        })
      }
      return
    })
    // Guild ban remove
    client.on('guildBanRemove', async (ban) => {
      const data = loggingData[ban.guild.id]
      if (!(data[1] && data[19])) return
      else {
        const logChannel = await ban.guild.channels.fetch(data[0])
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel.send({
          embeds: [
            {
              title: `${ban.user.tag} has been unabnned`,
              color: 0x00ff00,
              thumbnail: { url: ban.user.displayAvatarURL() },
              author: {
                name: ban.guild.name,
                icon_url: ban.guild.iconURL(),
              },
              fields: [
                {
                  name: 'Account Created',
                  value: ban.user.createdAt.toLocaleString(),
                  inline: false,
                },
                {
                  name: 'Reason',
                  value: ban.reason,
                  inline: false,
                },
              ],
              footer: {
                text: `Id: ${ban.user.id}`,
              },
              timestamp: new Date(),
            },
          ],
        })
      }
      return
    })
  },

  callback: async ({ guild, interaction }) => {
    await interaction.deferReply({ ephemeral: true })
    const channel = interaction.options.getChannel('channel')
    const enabled = interaction.options.getBoolean('enable')
    const inviteCreate = interaction.options.getBoolean('invite-create')
    const inviteDelete = interaction.options.getBoolean('invite-delete')
    const msgDelete = interaction.options.getBoolean('message-delete')
    const msgDelBulk = interaction.options.getBoolean('message-delete-bulk')
    const msgUpdate = interaction.options.getBoolean('message-update')
    const roleCreate = interaction.options.getBoolean('role-create')
    const roleDelete = interaction.options.getBoolean('role-delete')
    const roleUpdate = interaction.options.getBoolean('role-update')
    const threadCreate = interaction.options.getBoolean('thread-create')
    const threadDelete = interaction.options.getBoolean('thread-delete')
    const threadUpdate = interaction.options.getBoolean('thread-update')
    const voiceUpdate = interaction.options.getBoolean('voice-update')
    const memberRoles = interaction.options.getBoolean('member-roles')
    const nickChange = interaction.options.getBoolean('nickname-change')
    const memberLeave = interaction.options.getBoolean('leaves')
    const memberJoin = interaction.options.getBoolean('joins')
    const banAdd = interaction.options.getBoolean('bans')
    const banRemove = interaction.options.getBoolean('unban')

    if (channel.type !== 'GUILD_TEXT')
      return FailureMessage(interaction, 'Please tag a text channel')

    let data = loggingData[guild.id]
    if (!data) {
      console.log('Fetching log data')
      const results = await loggingSchema.findById(guild.id)
      if (results) {
        const {
          _logChannel,
          _enabled,
          _inviteCreate,
          _inviteDelete,
          _msgDelete,
          _msgBulkDelete,
          _msgUpdate,
          _roleCreate,
          _roleDelete,
          _roleUpdate,
          _threadCreate,
          _threadDelete,
          _threadUpdate,
          _voiceUpdate,
          _memberRoleUpdate,
          _memberNickUpdate,
          _memberRemove,
          _memberAdd,
          _banRemove,
          _banAdd,
        } = results
        data = loggingData[guild.id] = [
          _logChannel,
          _enabled,
          _inviteCreate,
          _inviteDelete,
          _msgDelete,
          _msgBulkDelete,
          _msgUpdate,
          _roleCreate,
          _roleDelete,
          _roleUpdate,
          _threadCreate,
          _threadDelete,
          _threadUpdate,
          _voiceUpdate,
          _memberRoleUpdate,
          _memberNickUpdate,
          _memberRemove,
          _memberAdd,
          _banRemove,
          _banAdd,
        ]
      }
    }

    const set = await loggingSchema
      .findOneAndUpdate(
        {
          _id: guild.id,
        },
        {
          _id: guild.id,
          logChannel: channel.id,

          enabled: enabled !== null ? enabled : data[1] || false,
          inviteCreate: inviteCreate !== null ? inviteCreate : data[2] || false,
          inviteDelete: inviteDelete !== null ? inviteDelete : data[3] || false,
          msgDelete: msgDelete !== null ? msgDelete : data[4] || false,
          msgBulkDelete: msgDelBulk !== null ? msgDelBulk : data[5] || false,
          msgUpdate: msgUpdate !== null ? msgUpdate : data[6] || false,
          roleCreate: roleCreate !== null ? roleCreate : data[7] || false,
          roleDelete: roleDelete !== null ? roleDelete : data[8] || false,
          roleUpdate: roleUpdate !== null ? roleUpdate : data[9] || false,
          threadCreate:
            threadCreate !== null ? threadCreate : data[10] || false,
          threadDelete:
            threadDelete !== null ? threadDelete : data[11] || false,
          threadUpdate:
            threadUpdate !== null ? threadUpdate : data[12] || false,
          voiceUpdate: voiceUpdate !== null ? voiceUpdate : data[13] || false,
          memberRoleUpdate:
            memberRoles !== null ? memberRoles : data[14] || false,
          memberNickUpdate:
            nickChange !== null ? nickChange : data[15] || false,
          memberRemove: memberLeave !== null ? memberLeave : data[16] || false,
          memberAdd: memberJoin !== null ? memberJoin : data[17] || false,
          banAdd: banAdd !== null ? banAdd : data[18] || false,
          banRemove: banRemove !== null ? banRemove : data[19] || false,
        },
        { upsert: true }
      )
      .catch(console.log)

    if (!set) return FailureMessage(interaction)

    loggingData[guild.id] = [
      channel.id,
      enabled !== null ? enabled : data[1] || false,
      inviteCreate !== null ? inviteCreate : data[2] || false,
      inviteDelete !== null ? inviteDelete : data[3] || false,
      msgDelete !== null ? msgDelete : data[4] || false,
      msgDelBulk !== null ? msgDelBulk : data[5] || false,
      msgUpdate !== null ? msgUpdate : data[6] || false,
      roleCreate !== null ? roleCreate : data[7] || false,
      roleDelete !== null ? roleDelete : data[8] || false,
      roleUpdate !== null ? roleUpdate : data[9] || false,
      threadCreate !== null ? threadCreate : data[10] || false,
      threadDelete !== null ? threadDelete : data[11] || false,
      threadUpdate !== null ? threadUpdate : data[12] || false,
      voiceUpdate !== null ? voiceUpdate : data[13] || false,
      memberRoles !== null ? memberRoles : data[14] || false,
      nickChange !== null ? nickChange : data[15] || false,
      memberLeave !== null ? memberLeave : data[16] || false,
      memberJoin !== null ? memberJoin : data[17] || false,
      banAdd !== null ? banAdd : data[18] || false,
      banRemove !== null ? banRemove : data[19] || false,
    ]

    console.log(loggingData[guild.id])

    return SuccessMessage(interaction, 'Settings saved')
  },
} as ICommand
