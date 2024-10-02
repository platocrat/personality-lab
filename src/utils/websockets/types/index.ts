import { 
  SocialRatingGamePlayers 
} from '@/utils'



export type UpdatePlayer__WebSocket = {
  players: SocialRatingGamePlayers,
  sessionId: string,
  isGameInSession: boolean
}