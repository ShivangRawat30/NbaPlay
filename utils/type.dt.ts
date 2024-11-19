export interface TruncateParams {
  text: string
  startChars: number
  endChars: number
  maxLength: number
}

export interface GameCardStruct {
  id: number
  name: string
  image: string
  ppg: number
  apg: number
  rpg: number
  spg: number
  championships: number
  mvps: number
  isFlipped?: boolean
  selected?: boolean
}

export interface ScoreStruct {
  id: number
  gameId: number
  player: string
  score: number
  prize: number
  played: boolean
}

export interface InvitationStruct {
  id: number
  gameId: number
  title: string
  sender: string
  receiver: string
  responded: boolean
  accepted: boolean
  stake: number
  timestamp: number
}

export interface GameParams {
  id?: number
  title: string
  participants: string
  numberOfWinners: string
  startDate: string | number
  endDate: string | number
  description: string
  stake: string | number
}

export interface GameStruct {
  id: number
  owner: string
  participants: number
  stake: number
  winner: string
  deleted: boolean
  paidOut: boolean
}

export interface GlobalState {
  games: GameStruct[]
  game: GameStruct | null
  scores: ScoreStruct[]
  invitations: InvitationStruct[]
  createModal: string
  resultModal: string
  inviteModal: string
}

export interface RootState {
  globalStates: GlobalState
}
