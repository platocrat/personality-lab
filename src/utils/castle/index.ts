// config/castle.js
import { Castle } from '@castleio/sdk'

export const castle = new Castle({ 
  apiSecret: process.env.CASTLE_API_SECRET
})