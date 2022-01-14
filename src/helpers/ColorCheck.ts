import { ColorResolvable } from 'discord.js'

const ColorCheck = (color?: ColorResolvable | string): ColorResolvable => {
  const DEFAULT = '#ff9ed7'
  if (!color) return DEFAULT
  else if (color === 'ADD') return '#8FFF5C'
  else if (color === 'REMOVE') return '#F5515A'
  else if (color === 'STATUS') return '#5CEBE6'
  else if (color === 'PLAIN') return '#F4F1DE'
  else return DEFAULT
}

export default ColorCheck
