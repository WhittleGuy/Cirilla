import { Guild, GuildMember, User } from 'discord.js'

const SendError = (file, guild: Guild, member: GuildMember | User, err) => {
  const date = new Date().toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  let user
  if (member !== null) {
    user = member instanceof GuildMember ? member.displayName : member.username
  } else {
    user = 'None'
  }

  console.log(`[-] ${date} | Error in ${guild} by ${user}\n\t${file} - ${err}`)
}

export default SendError
