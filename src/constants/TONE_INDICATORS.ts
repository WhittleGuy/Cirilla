export interface TONE {
  name: string
  shortDesc: string
  longDesc: string
  duplicate: boolean
}

export const TONE_INDICATORS: TONE[] = [
  { name: '/j', shortDesc: 'Joking', longDesc: '', duplicate: false },
  { name: '/hj', shortDesc: 'Half Joking', longDesc: '', duplicate: false },
  { name: '/s', shortDesc: 'Sarcastic', longDesc: '', duplicate: false },
  { name: '/gen', shortDesc: 'Genuine', longDesc: '', duplicate: false },
  { name: '/g', shortDesc: 'Genuine', longDesc: '', duplicate: true },
  { name: '/srs', shortDesc: 'Serious', longDesc: '', duplicate: false },
  { name: '/nsrs', shortDesc: 'Not Serious', longDesc: '', duplicate: false },
  {
    name: '/pos',
    shortDesc: 'Positive Connotation',
    longDesc: '',
    duplicate: false,
  },
  {
    name: '/pc',
    shortDesc: 'Positive Connotation',
    longDesc: '',
    duplicate: true,
  },
  {
    name: '/neu',
    shortDesc: 'Neutral Connotation',
    longDesc: '',
    duplicate: false,
  },
  {
    name: '/neg',
    shortDesc: 'Negative Connotation',
    longDesc: '',
    duplicate: false,
  },
  {
    name: '/nc',
    shortDesc: 'Negative Connotation',
    longDesc: '',
    duplicate: true,
  },
  { name: '/p', shortDesc: 'Platonic', longDesc: '', duplicate: false },
  { name: '/r', shortDesc: 'Romantic', longDesc: '', duplicate: false },
  { name: '/c', shortDesc: 'Copypasta', longDesc: '', duplicate: false },
  { name: '/l', shortDesc: 'Lyrics', longDesc: '', duplicate: false },
  { name: '/ly', shortDesc: 'Lyrics', longDesc: '', duplicate: true },
  { name: '/lh', shortDesc: 'Light-hearted', longDesc: '', duplicate: false },
  { name: '/nm', shortDesc: 'Not Mad', longDesc: '', duplicate: false },
  { name: '/lu', shortDesc: 'Little Upset', longDesc: '', duplicate: false },
  {
    name: '/nbh',
    shortDesc: 'Directed At Nobody Here',
    longDesc: '',
    duplicate: false,
  },
  {
    name: '/nsb',
    shortDesc: 'Not Subtweeting',
    longDesc: '',
    duplicate: false,
  },
  { name: '/sx', shortDesc: 'Sexual Intent', longDesc: '', duplicate: false },
  { name: '/x', shortDesc: 'Sexual Intent', longDesc: '', duplicate: true },
  {
    name: '/nsx',
    shortDesc: 'Non-sexual Intent',
    longDesc: '',
    duplicate: false,
  },
  {
    name: '/nx',
    shortDesc: 'Non-sexual Intent',
    longDesc: '',
    duplicate: true,
  },
  {
    name: '/rh',
    shortDesc: 'Rhetorical Question',
    longDesc: '',
    duplicate: false,
  },
  {
    name: '/rt',
    shortDesc: 'Rhetorical Question',
    longDesc: '',
    duplicate: true,
  },
  { name: '/t', shortDesc: 'Teasing', longDesc: '', duplicate: false },
  { name: '/ij', shortDesc: 'Inside Joke', longDesc: '', duplicate: false },
  { name: '/m', shortDesc: 'Metaphorically', longDesc: '', duplicate: false },
  { name: '/li', shortDesc: 'Literally', longDesc: '', duplicate: false },
  { name: '/hyp', shortDesc: 'Hyperbole', longDesc: '', duplicate: false },
  { name: '/f', shortDesc: 'Fake', longDesc: '', duplicate: false },
  { name: '/th', shortDesc: 'Threat', longDesc: '', duplicate: false },
  { name: '/cb', shortDesc: 'Clickbait', longDesc: '', duplicate: false },
]
