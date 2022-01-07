import { ColorResolvable } from 'discord.js'

const discStrings = [
  'DEFAULT',
  'WHITE',
  'AQUA',
  'GREEN',
  'BLUE',
  'YELLOW',
  'PURPLE',
  'LUMINOUS_VIVID_PINK',
  'FUCHSIA',
  'GOLD',
  'ORANGE',
  'RED',
  'GREY',
  'NAVY',
  'DARK_AQUA',
  'DARK_GREEN',
  'DARK_BLUE',
  'DARK_PURPLE',
  'DARK_VIVID_PINK',
  'DARK_GOLD',
  'DARK_ORANGE',
  'DARK_RED',
  'DARK_GREY',
  'DARKER_GREY',
  'LIGHT_GREY',
  'DARK_NAVY',
  'BLURPLE',
  'GREYPLE',
  'DARK_BUT_NOT_BLACK',
  'NOT_QUITE_BLACK',
  'RANDOM',
]

const hexRegEx = /^#?([a-f\d]{3}){1,2}$/i
const RGBArrayRegEx = /^\[(\d{1,3}),\W?(\d{1,3}),\W?(\d{1,3})\]$/i

export const ResolveColor = (input: string): string | boolean => {
  const color = input.trim().replace(' ', '_').toUpperCase()
  if (input.match(hexRegEx)) return input
  else if (discStrings.includes(color)) return color
  return false
}
