export const DOG_STATE = {
  PATROL: 'patrol',
  CHASE: 'chase',
  ATTACK: 'attack', 
  IDLE: 'idle'
} as const

export type DogState = typeof DOG_STATE[keyof typeof DOG_STATE]

export interface DogStates extends Record<DogState, () => void> {}

