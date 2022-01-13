import {
  Client,
  Guild,
  GuildTextBasedChannel,
  NonThreadGuildBasedChannel,
  Role,
} from 'discord.js'
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
      name: 'timeouts',
      description: 'Log when a user is timed-out, or a timeout is removed',
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
    {
      name: 'channel-create',
      description: 'Log when a channel is created',
      type: 5,
      required: false,
    },
    {
      name: 'channel-delete',
      description: 'Log when a channel is deleted',
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
        memberTimeout,
        memberRemove,
        memberAdd,
        banAdd,
        banRemove,
        channelCreate,
        channelDelete,
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
        memberTimeout,
        memberRemove,
        memberAdd,
        banAdd,
        banRemove,
        channelCreate,
        channelDelete,
      ]
    }

    // Time since
    const TimeSince = (date0) => {
      const now = new Date().getTime()
      const diff = now - date0
      const Y = Math.floor(diff / 31536000000)
      const M = Math.floor((diff % 31536000000) / 2629800000)
      const d = Math.floor((diff % 2629800000) / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)

      return `${Y ? Y + ' yrs, ' : ''}${M ? M + ' months, ' : ''}${
        d ? d + ' days, ' : ''
      }${h ? h + ' hr, ' : ''}${m ? m + ' min, ' : ''}${s ? s + ' sec' : ''}`
    }

    // Invite creation
    client.on('inviteCreate', async (inv) => {
      const data = loggingData[inv.guild.id]
      if (!data) return
      if (!(data[1] && data[2])) return
      else {
        const guild = inv.guild as Guild
        const logChannel = (await guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel
          .send({
            embeds: [
              {
                color: 0x00ff00,
                title: `Invite Created`,
                author: {
                  name: inv.inviter.tag,
                  icon_url: inv.inviter.displayAvatarURL(),
                },
                footer: { text: `Id: ${inv.inviter.id}` },
                timestamp: new Date(),
                description: `Channel: ${inv.channel}
                Code: ${inv.code}
                Max Uses: ${inv.maxUses.toString() || 'None'}
                Target User: ${inv.targetUser || 'None'}
                Expires: ${inv.expiresAt.toLocaleString()}`,
              },
            ],
          })
          .catch(console.log)
      }
      return
    })

    // Invite deletion
    client.on('inviteDelete', async (inv) => {
      const data = loggingData[inv.guild.id]
      if (!data) return
      if (!(data[1] && data[3])) return
      else {
        const guild = inv.guild as Guild
        const logChannel = (await guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel
          .send({
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
                    value: `${inv.channel}`,
                    inline: true,
                  },
                  {
                    name: 'Code',
                    value: `${inv.code}`,
                    inline: true,
                  },
                ],
              },
            ],
          })
          .catch(console.log)
      }
      return
    })
    // Message Deletion
    client.on('messageDelete', async (msg) => {
      const data = loggingData[msg.guild.id]
      if (!data) return
      if (msg.partial) msg = await msg.fetch()
      if (!(data[1] && data[4])) return
      else {
        const guild = msg.guild as Guild
        const logChannel = (await guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (msg.author.bot) return
        if (logChannel.type !== 'GUILD_TEXT') return
        const msgChannel = msg.guild.channels.cache.get(msg.channel.id)
        let url
        if (msg.attachments) url = msg.attachments?.first()?.url
        await logChannel
          .send({
            embeds: [
              {
                color: 0xff0000,
                // title: 'Message Delete',
                author: {
                  name: msg.member.user.tag,
                  icon_url: msg.member.user.displayAvatarURL(),
                },
                image: { url: url ? url : '' },
                footer: {
                  text: `Id: ${msg.member.user.id}`,
                },
                timestamp: new Date(),
                description: `**Message deleted in ${msgChannel}**
                ${msg?.content}`,
              },
            ],
          })
          .catch(console.log)
        if (msg.attachments?.size > 1) {
          msg.attachments = msg.attachments.filter(
            (a) => a.id !== msg.attachments.first().id
          )
          msg.attachments.forEach(async (a) => {
            a.url = a?.url
            await logChannel
              .send({
                embeds: [
                  {
                    color: 0xff0000,
                    // title: 'Image Delete',
                    author: {
                      name: msg.member.user.tag,
                      icon_url: msg.member.user.displayAvatarURL(),
                    },
                    image: { url: url ? url : '' },
                    footer: {
                      text: `Id: ${msg.member.user.id}`,
                    },
                    timestamp: new Date(),
                    description: `**Image deleted in ${msgChannel}**`,
                  },
                ],
              })
              .catch(console.log)
          })
        }
      }

      return
    })
    // Message Bulk Delete
    client.on('messageDeleteBulk', async (msgs) => {
      const data = loggingData[msgs.first().guild.id]
      if (!data) return
      if (!(data[1] && data[5])) return
      else {
        const guild = msgs.first().guild as Guild
        const logChannel = (await guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        const msgChannel = guild.channels.cache.get(msgs.first().channel.id)
        await logChannel
          .send({
            embeds: [
              {
                color: 0xff0000,
                title: 'Bulk Delete',
                author: {
                  name: guild.name,
                  icon_url: guild.iconURL(),
                },

                timestamp: new Date(),
                description: `**${msgs.size} messages deleted in ${msgChannel}**`,
              },
            ],
          })
          .catch(console.log)
      }
      return
    })
    // Message update
    client.on('messageUpdate', async (oldMsg, newMsg) => {
      const data = loggingData[oldMsg.guild.id]
      if (!data) return
      if (oldMsg.partial) oldMsg = await oldMsg.fetch()
      if (oldMsg.type === 'THREAD_CREATED') return
      if (oldMsg.author.bot) return
      if (oldMsg.content === newMsg.content) return
      const { guild } = oldMsg
      if (!(data[1] && data[6])) return
      else {
        const logChannel = (await guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        const msgChannel = guild.channels.cache.get(oldMsg.channel.id)
        await logChannel
          .send({
            embeds: [
              {
                color: ColorCheck(),
                // title: 'Message Edited',
                author: {
                  name: oldMsg.member.user.tag,
                  icon_url: oldMsg.member.user.displayAvatarURL(),
                },
                footer: { text: `Id: ${oldMsg.id}` },
                timestamp: new Date(),
                description: `**[Message](${newMsg.url}) edited in ${msgChannel}**`,
                fields: [
                  {
                    name: 'Before',
                    value: `${oldMsg?.content}`,
                    inline: false,
                  },
                  {
                    name: 'After',
                    value: `${newMsg?.content}`,
                    inline: false,
                  },
                ],
              },
            ],
          })
          .catch(console.log)
      }
      return
    })
    // Role create
    client.on('roleCreate', async (role) => {
      const data = loggingData[role.guild.id]
      if (!data) return
      if (!(data[1] && data[7])) return
      else {
        const logChannel = (await role.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel
          .send({
            embeds: [
              {
                color: 0x00ff00,
                title: 'Role Create',
                author: {
                  name: role.guild.name,
                  icon_url: role.guild.iconURL(),
                },
                thumbnail: { url: role.iconURL() },
                timestamp: new Date(),
                description: `${role} **Created**\n
              Color: ${role.hexColor}
              Position: ${role.position}
              Permissions: ${role.permissions.toArray().join(', ')}`,
              },
            ],
          })
          .catch(console.log)
      }
      return
    })
    // Role delete
    client.on('roleDelete', async (role) => {
      const data = loggingData[role.guild.id]
      if (!data) return
      if (!(data[1] && data[8])) return
      else {
        const logChannel = (await role.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel
          .send({
            embeds: [
              {
                color: 0xff0000,
                title: 'Role Delete',
                author: {
                  name: role.guild.name,
                  icon_url: role.guild.iconURL(),
                },
                thumbnail: { url: role.iconURL() },
                timestamp: new Date(),
                description: `@${role.name} **Deleted**\n
              Color: ${role.hexColor}
              Position: ${role.position}
              Permissions: ${role.permissions.toArray().join(', ')}`,
              },
            ],
          })
          .catch(console.log)
      }
      return
    })
    // Role update
    client.on('roleUpdate', async (oldRole, newRole) => {
      const data = loggingData[oldRole.guild.id]
      if (!(data[1] && data[9])) return
      else {
        const logChannel = (await oldRole.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        // Don't log position change only
        if (
          oldRole.hexColor === newRole.hexColor &&
          oldRole.name == newRole.name &&
          oldRole.permissions === newRole.permissions
        )
          return
        await logChannel.send({
          embeds: [
            {
              color: ColorCheck(),
              title: 'Role Updated',
              author: {
                name: oldRole.guild.name,
                icon_url: oldRole.guild.iconURL(),
              },
              thumbnail: { url: newRole.iconURL() },
              timestamp: new Date(),
              description: `**Before**
              Role: @${oldRole.name}
              Color: ${oldRole.hexColor}
              Position: ${oldRole.position}
              Permissions: ${oldRole.permissions.toArray().join(', ')}\n
              **After**
              Role: ${newRole}
              Color: ${newRole.hexColor}
              Position: ${newRole.position}
              Permissions: ${newRole.permissions.toArray().join(', ')}`,
            },
          ],
        })
      }
      return
    })
    // Thread create
    client.on('threadCreate', async (thread) => {
      const data = loggingData[thread.guild.id]
      if (!data) return
      if (!(data[1] && data[10])) return
      else {
        const logChannel = (await thread.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel
          .send({
            embeds: [
              {
                color: 0x00ff00,
                title: 'Thread Created',
                author: {
                  name: thread.guild.name,
                  icon_url: thread.guild.iconURL(),
                },
                timestamp: new Date(),
                description: `${thread} **Created**\n
                Parent: ${thread.parent || 'None'}
                Owner: ${(await thread.fetchOwner()).user || 'None'}
                Message
                ${thread.messages.cache?.first()?.content || 'None'}`,
              },
            ],
          })
          .catch(console.log)
      }
      return
    })
    // Thread delete
    client.on('threadDelete', async (thread) => {
      const data = loggingData[thread.guild.id]
      if (!data) return
      if (!(data[1] && data[11])) return
      else {
        const logChannel = (await thread.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel
          .send({
            embeds: [
              {
                color: 0xff0000,
                title: 'Thread Deleted',
                author: {
                  name: thread.guild.name,
                  icon_url: thread.guild.iconURL(),
                },
                timestamp: new Date(),
                description: `${thread.name} **Deleted**\n
                Parent: ${thread.parent}`,
              },
            ],
          })
          .catch(console.log)
      }
      return
    })
    // Thread update
    client.on('threadUpdate', async (oldThread, newThread) => {
      const data = loggingData[oldThread.guild.id]
      if (!data) return
      if (!(data[1] && data[12])) return
      else {
        const logChannel = (await oldThread.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel
          .send({
            embeds: [
              {
                color: ColorCheck(),
                title: 'Thread Updated',
                author: {
                  name: oldThread.guild.name,
                  icon_url: oldThread.guild.iconURL(),
                },
                timestamp: new Date(),
                description: `${newThread.name} **Updated**\n
              Parent: ${newThread.parent}
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
          .catch(console.log)
      }
      return
    })
    // Voice status update
    client.on('voiceStateUpdate', async (oldState, newState) => {
      const data = loggingData[oldState.guild.id]
      if (!data) return
      if (!(data[1] && data[13])) return
      const logChannel = (await oldState.guild.channels
        .fetch(data[0])
        .catch(console.log)) as NonThreadGuildBasedChannel
      if (logChannel.type !== 'GUILD_TEXT') return
      else {
        // channel shift
        if (oldState.channel !== newState.channel) {
          if (oldState.channel === null) {
            await logChannel
              .send({
                embeds: [
                  {
                    color: 0x00ff00,
                    title: 'Voice Channel Connect',
                    author: {
                      name: oldState.member.user.tag,
                      icon_url: oldState.member.user.displayAvatarURL(),
                    },
                    description: `User Joined Voice Channel ${newState.channel}`,
                  },
                ],
              })
              .catch(console.log)
          } else if (newState.channel === null) {
            await logChannel
              .send({
                embeds: [
                  {
                    color: 0xff0000,
                    title: 'Voice Channel Disconnect',
                    author: {
                      name: oldState.member.user.tag,
                      icon_url: oldState.member.user.displayAvatarURL(),
                    },
                    description: `User Left Voice Channel ${oldState.channel}`,
                  },
                ],
              })
              .catch(console.log)
          } else {
            await logChannel
              .send({
                embeds: [
                  {
                    title: 'Voice Channel Switch',
                    color: ColorCheck(),
                    author: {
                      name: oldState.member.user.tag,
                      icon_url: oldState.member.user.displayAvatarURL(),
                    },
                    // description: `${oldState.member.user} switched channels`,
                    fields: [
                      {
                        name: 'Before',
                        value: `${oldState.channel}`,
                        inline: true,
                      },
                      {
                        name: 'After',
                        value: `${newState.channel}`,
                        inline: true,
                      },
                    ],
                  },
                ],
              })
              .catch(console.log)
          }
        }
      }
      return
    })
    // Member nickname change & role update
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
      const data = loggingData[oldMember.guild.id]
      if (!data) return
      if (
        data[1] &&
        data[14] &&
        oldMember.roles.cache.size !== newMember.roles.cache.size
      ) {
        // Role change
        const logChannel = (await oldMember.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
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
        await logChannel
          .send({
            embeds: [
              {
                color: ColorCheck(roleGiven ? '#00ff00' : '#ff0000'),
                // title: `${roleGiven ? 'Role Added' : 'Role Removed'}`,
                author: {
                  name: oldMember.user.tag,
                  icon_url: oldMember.user.displayAvatarURL(),
                },
                description: `${
                  roleGiven
                    ? `${oldMember.user} was given the ${changeRole} role`
                    : `${changeRole} was removed from ${oldMember.user}`
                }`,
                footer: {
                  text: `Id: ${newMember.id}`,
                },
                timestamp: new Date(),
              },
            ],
          })
          .catch(console.log)
      }
      // Nick Change
      else if (
        data[1] &&
        data[15] &&
        oldMember.nickname !== newMember.nickname
      ) {
        const logChannel = (await oldMember.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel
          .send({
            embeds: [
              {
                title: `Nickname Changed`,
                color: ColorCheck(),
                thumbnail: { url: oldMember.user.displayAvatarURL() },
                description: `**${newMember.user} nickname changed**`,
                fields: [
                  {
                    name: 'Before',
                    value: oldMember.nickname,
                    inline: false,
                  },
                  {
                    name: 'After',
                    value: newMember.nickname,
                    inline: false,
                  },
                ],
                footer: {
                  text: `Id: ${newMember.id}`,
                },
                timestamp: new Date(),
              },
            ],
          })
          .catch(console.log)
      }
      // Timeout
      else if (
        data[1] &&
        data[16] &&
        oldMember.communicationDisabledUntilTimestamp !==
          newMember.communicationDisabledUntilTimestamp
      ) {
        const logChannel = (await oldMember.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        const timeoutAdded = newMember.communicationDisabledUntilTimestamp
          ? true
          : false
        const fields = timeoutAdded
          ? [
              {
                name: 'Until',
                value: new Date(
                  newMember.communicationDisabledUntilTimestamp
                ).toLocaleString(),
                inline: false,
              },
            ]
          : []
        await logChannel
          .send({
            embeds: [
              {
                // title: `Timeout ${timeoutAdded ? 'Added' : 'Removed'}`,
                color: ColorCheck(timeoutAdded ? '#ff0000' : '#00ff00'),
                author: {
                  name: oldMember.user.tag,
                  icon_url: oldMember.user.displayAvatarURL(),
                },
                // thumbnail: { url: oldMember.user.displayAvatarURL() },
                description: `**Timeout ${
                  timeoutAdded ? 'added to' : 'removed from'
                } ${newMember.user}**`,
                fields: fields,
                footer: {
                  text: `Id: ${newMember.id}`,
                },
                timestamp: new Date(),
              },
            ],
          })
          .catch(console.log)
      }
      return
    })
    // Guild member remove
    client.on('guildMemberRemove', async (member) => {
      const data = loggingData[member.guild.id]
      if (!data) return
      if (!(data[1] && data[17])) return
      else {
        const logChannel = (await member.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel
          .send({
            embeds: [
              {
                title: 'User Leave',
                color: 0xff0000,
                thumbnail: { url: member.user.displayAvatarURL() },
                description: `${member.user} **Left Server**\n
                Bot: ${member.user.bot ? 'True' : 'False'}
                Account Created: ${member.user.createdAt.toLocaleString()}
                Time in Server: ${TimeSince(
                  new Date(member.joinedTimestamp).getTime()
                )}`,
                footer: {
                  text: `Id: ${member.id}`,
                },
                timestamp: new Date(),
              },
            ],
          })
          .catch(console.log)
      }
      return
    })
    // Guild member add
    client.on('guildMemberAdd', async (member) => {
      const data = loggingData[member.guild.id]
      if (!data) return
      if (!(data[1] && data[18])) return
      else {
        const logChannel = (await member.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        const { guild } = member
        await logChannel
          .send({
            embeds: [
              {
                // title: 'User Join',
                color: 0x00ff00,
                title: 'User Join',
                thumbnail: { url: member.user.displayAvatarURL() },
                author: {
                  name: guild.name,
                  icon_url: guild.iconURL(),
                },
                description: `${member.user} **Joined Server**\n
                **Account Age**:
                ${TimeSince(new Date(member.user.createdTimestamp).getTime())}`,
                footer: {
                  text: `Id: ${member.id}`,
                },
                timestamp: new Date(),
              },
            ],
          })
          .catch(console.log)
      }

      return
    })
    // Guild ban add
    client.on('guildBanAdd', async (ban) => {
      const data = loggingData[ban.guild.id]
      if (!data) return
      if (!(data[1] && data[19])) return
      else {
        const logChannel = (await ban.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel
          .send({
            embeds: [
              {
                color: 0xff0000,
                title: 'Ban',
                thumbnail: { url: ban.user.displayAvatarURL() },
                author: {
                  name: ban.guild.name,
                  icon_url: ban.guild.iconURL(),
                },
                description: `${ban.user} **Banned**\n
                Account Age: ${TimeSince(
                  new Date(ban.user.createdTimestamp).getTime()
                )}
                Reason: ${ban.reason}`,
                footer: {
                  text: `Id: ${ban.user.id}`,
                },
                timestamp: new Date(),
              },
            ],
          })
          .catch(console.log)
      }
      return
    })
    // Guild ban remove
    client.on('guildBanRemove', async (ban) => {
      const data = loggingData[ban.guild.id]
      if (!data) return
      if (!(data[1] && data[20])) return
      else {
        const logChannel = (await ban.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel
          .send({
            embeds: [
              {
                color: 0x00ff00,
                title: 'Unban',
                thumbnail: { url: ban.user.displayAvatarURL() },
                author: {
                  name: ban.guild.name,
                  icon_url: ban.guild.iconURL(),
                },
                description: `${ban.user} **Unbanned**\n
                Account Age: ${TimeSince(
                  new Date(ban.user.createdTimestamp).getTime()
                )}
                Reason: ${ban.reason}`,
                footer: {
                  text: `Id: ${ban.user.id}`,
                },
                timestamp: new Date(),
              },
            ],
          })
          .catch(console.log)
      }
      return
    })
    // Channel create
    client.on('channelCreate', async (chan) => {
      const data = loggingData[chan.guild.id]
      if (!data) return
      if (!(data[1] && data[21])) return
      else {
        const logChannel = (await chan.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel
          .send({
            embeds: [
              {
                color: 0x00ff00,
                title: 'Channel Created',
                author: {
                  name: chan.guild.name,
                  icon_url: chan.guild.iconURL(),
                },
                description: `${chan}`,
                timestamp: new Date(),
              },
            ],
          })
          .catch(console.log)
      }
      return
    })
    // Channel delete
    client.on('channelDelete', async (ch) => {
      const chan = ch as GuildTextBasedChannel
      const data = loggingData[chan.guild.id]
      if (!data) return
      if (!(data[1] && data[22])) return
      else {
        const logChannel = (await chan.guild.channels
          .fetch(data[0])
          .catch(console.log)) as NonThreadGuildBasedChannel
        if (logChannel.type !== 'GUILD_TEXT') return
        await logChannel
          .send({
            embeds: [
              {
                color: 0xff0000,
                title: 'Channel Deleted',
                author: {
                  name: chan.guild.name,
                  icon_url: chan.guild.iconURL(),
                },
                description: `#${chan.name}`,
                timestamp: new Date(),
              },
            ],
          })
          .catch(console.log)
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
    const timeouts = interaction.options.getBoolean('timeouts')
    const memberLeave = interaction.options.getBoolean('leaves')
    const memberJoin = interaction.options.getBoolean('joins')
    const banAdd = interaction.options.getBoolean('bans')
    const banRemove = interaction.options.getBoolean('unban')
    const channelCreate = interaction.options.getBoolean('channel-create')
    const channelDelete = interaction.options.getBoolean('channel-delete')

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
          _timeouts,
          _memberRemove,
          _memberAdd,
          _banRemove,
          _banAdd,
          _channelCreate,
          _channelDelete,
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
          _timeouts,
          _memberRemove,
          _memberAdd,
          _banRemove,
          _banAdd,
          _channelCreate,
          _channelDelete,
        ]
      }
    }

    const updater = (vari, dat, index, def) => {
      return vari ? vari : dat ? dat[index] : def
    }

    const set = await loggingSchema
      .findOneAndUpdate(
        {
          _id: guild.id,
        },
        {
          _id: guild.id,
          logChannel: channel.id,
          enabled: updater(enabled, data, 1, false),
          inviteCreate: updater(inviteCreate, data, 2, false),
          inviteDelete: updater(inviteDelete, data, 3, false),
          msgDelete: updater(msgDelete, data, 4, false),
          msgBulkDelete: updater(msgDelBulk, data, 5, false),
          msgUpdate: updater(msgUpdate, data, 6, false),
          roleCreate: updater(roleCreate, data, 7, false),
          roleDelete: updater(roleDelete, data, 8, false),
          roleUpdate: updater(roleUpdate, data, 9, false),
          threadCreate: updater(threadCreate, data, 10, false),
          threadDelete: updater(threadDelete, data, 11, false),
          threadUpdate: updater(threadUpdate, data, 12, false),
          voiceUpdate: updater(voiceUpdate, data, 13, false),
          memberRoleUpdate: updater(memberRoles, data, 14, false),
          memberNickUpdate: updater(nickChange, data, 15, false),
          memberTimeout: updater(timeouts, data, 16, false),
          memberRemove: updater(memberLeave, data, 17, false),
          memberAdd: updater(memberJoin, data, 18, false),
          banAdd: updater(banAdd, data, 19, false),
          banRemove: updater(banRemove, data, 20, false),
          channelCreate: updater(channelCreate, data, 21, false),
          channelDelete: updater(channelDelete, data, 22, false),
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
      timeouts !== null ? timeouts : data[16] || false,
      memberLeave !== null ? memberLeave : data[17] || false,
      memberJoin !== null ? memberJoin : data[18] || false,
      banAdd !== null ? banAdd : data[19] || false,
      banRemove !== null ? banRemove : data[20] || false,
      channelCreate !== null ? channelCreate : data[21] || false,
      channelDelete !== null ? channelDelete : data[22] || false,
    ]

    console.log(loggingData[guild.id])

    return SuccessMessage(interaction, 'Settings saved')
  },
} as ICommand
