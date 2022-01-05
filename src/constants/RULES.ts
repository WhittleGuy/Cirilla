export interface RULE {
  category: string
  description: string
}

export const RULES: RULE[] = [
  {
    category: 'Speech',
    description:
      'Zero tolerance for homophobic, transphobic, racist, or marginalizing language',
  },
  {
    category: 'Speech',
    description: 'Zero tolerance for jokes pertaining to traumatic experiences',
  },
  {
    category: 'Behavior',
    description: 'Zero tolerance for harassment',
  },
  {
    category: 'Behavior',
    description: 'No spam',
  },
  {
    category: 'Behavior',
    description: 'Keep content appropriate to channel descriptions',
  },
  {
    category: 'Behavior',
    description: 'Use bots only in the designated channels',
  },
  {
    category: 'Behavior',
    description: 'Self promotion is to be kept in the promo channel',
  },
  {
    category: 'Behavior',
    description: 'No linking to other Discord servers',
  },
  {
    category: 'Privacy',
    description: 'Zero tolerance for doxing',
  },
  {
    category: 'Moderation',
    description: 'Moderation actions are at the discreation of the mod team',
  },
  {
    category: 'Moderation',
    description: 'Usernames must be English only and SFW',
  },
  {
    category: 'Moderation',
    description: 'Blocking any member of the mod team may result in a ban',
  },
  {
    category: 'Moderation',
    description: 'If a server member is causing problems, DM ModMail',
  },
  {
    category: 'Administration',
    description: 'Report server issues to ModMail',
  },
]
