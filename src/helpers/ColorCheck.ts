import { ColorResolvable } from 'discord.js'

const ColorCheck = (color?: ColorResolvable | string): ColorResolvable => {
  // const DEFAULT = '#ff9ed7'
  const DEFAULT = '#F49CBB'
  if (!color) return DEFAULT
  else if (color === 'ADD') return '#23CE6B'
  else if (color === 'REMOVE') return '#8F0000'
  else if (color === 'STATUS') return '#6F58C9'
  else if (color === 'PLAIN') return '#F4F1DE'
  else if (color === 'NONE') return '#2F3136'
  else if (color === 'WARN') return '#D4660C'
  else if (color.toString().match(/^#[0-9a-f]{6}$/))
    return color as ColorResolvable
  else return DEFAULT
}

export default ColorCheck
