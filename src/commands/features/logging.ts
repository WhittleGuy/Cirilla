import {
  Client,
  GuildTextBasedChannel,
  Interaction,
  TextChannel,
} from 'discord.js'
import { ICommand } from 'wokcommands'
import { FailureMessage, SuccessMessage } from '../../helpers'
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
  testOnly: true,
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

  init: (client: Client) => {
    // Refresh guild data on message
    let data
    let logChannel
    client.on('messageCreate', async (msg) => {
      const { guild } = msg

      data = loggingData[guild.id]

      if (!data) {
        const results = await loggingSchema.findById({ _id: guild.id })
        if (!results) return

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
          banRemove,
          banAdd,
        } = results
        data = loggingData[guild.id] = [
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
          banRemove,
          banAdd,
        ]
      }

      logChannel = await msg.guild.channels.fetch(data[0])
      if (logChannel.type !== 'GUILD_TEXT') return
      console.log(loggingData[guild.id])
    })

    // Invite creation
    client.on('inviteCreate', () => {
      if (!(data[1] && data[2])) return
      return
    })

    // Invite deletion
    client.on('inviteDelete', () => {
      if (!(data[1] && data[3])) return
      return
    })
    // Message Deletion
    client.on('messageDelete', async (msg) => {
      if (!(data[1] && data[4])) return
      else {
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
              description: `${msg.content}`,
            },
          ],
        })
      }
      return
    })
    // Message Bulk Delete
    client.on('messageDeleteBulk', () => {
      if (!(data[1] && data[5])) return
      return
    })
    // Message update
    client.on('messageUpdate', () => {
      if (!(data[1] && data[6])) return
      return
    })
    // Role create
    client.on('roleCreate', () => {
      if (!(data[1] && data[7])) return
      return
    })
    // Role delete
    client.on('roleDelete', () => {
      if (!(data[1] && data[8])) return
      return
    })
    // Role update
    client.on('roleUpdate', () => {
      if (!(data[1] && data[9])) return
      return
    })
    // Thread create
    client.on('threadCreate', () => {
      if (!(data[1] && data[10])) return
      return
    })
    // Thread delete
    client.on('threadDelete', () => {
      if (!(data[1] && data[11])) return
      return
    })
    // Thread update
    client.on('threadUpdate', () => {
      if (!(data[1] && data[12])) return
      return
    })
    // Voice status update
    client.on('voiceStateUpdate', () => {
      if (!(data[1] && data[13])) return
      return
    })
    // Member nickname change & role update
    client.on('guildMemberUpdate', () => {
      if (!(data[1] && data[14])) return
      else if (!(data[1] && data[15])) return
    })
    // Guild member remove
    client.on('guildMemberRemove', () => {
      if (!(data[1] && data[16])) return
      return
    })
    // Guild member add
    client.on('guildMemberAdd', () => {
      if (!(data[1] && data[17])) return
      return
    })
    // Guild ban add
    client.on('guildBanAdd', () => {
      if (!(data[1] && data[18])) return
      return
    })
    // Guild ban remove
    client.on('guildBanRemove', () => {
      if (!(data[1] && data[19])) return
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
