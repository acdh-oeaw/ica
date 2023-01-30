export const genders = ['all', 'female', 'male'] as const

export type Gender = (typeof genders)[number]
