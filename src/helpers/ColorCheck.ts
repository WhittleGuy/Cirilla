import { ColorResolvable } from 'discord.js'

const ColorCheck = (color?: ColorResolvable | string): ColorResolvable => {
  // const DEFAULT = '#FF9ED7'
  const DEFAULT = '#FF9ED7'
  if (!color) return DEFAULT
  else if (color === 'ADD') return '#00B000'
  else if (color === 'REMOVE') return '#B00000'
  else if (color === 'STATUS') return '#FF9ED7'
  else if (color === 'PLAIN') return '#F4F1DE'
  else if (color === 'NONE') return '#2F3136'
  else if (color === 'WARN') return '#FF9000'
  else if (color.toString().match(/^#[0-9a-f]{6}$/))
    return color as ColorResolvable
  else return DEFAULT
}

export default ColorCheck
