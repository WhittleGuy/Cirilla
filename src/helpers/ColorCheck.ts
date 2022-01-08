import { ColorResolvable } from 'discord.js'

export const ColorCheck = (color?: ColorResolvable): ColorResolvable => {
  const DEFAULT = '#ff9ed7'
  if (!color) return DEFAULT
  let colorString = color.toString()
  if (colorString.match(/^#[a-f\d]{6}$/i)) {
    return color
  }
  return DEFAULT
}
