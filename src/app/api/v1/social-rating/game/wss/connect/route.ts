/* /api/v1/social-rating/game/wss/connect/route.ts */
// Externals
import { NextRequest, NextResponse } from 'next/server'



export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'POST') {
    const connectionId = req.headers.get('X-Amzn-Connection-Id')
    const ipAddress = req.headers.get('x-forwarded-for')

    console.log(`Client connected: Connection ID - ${connectionId}, IP - ${ipAddress}`)
    // Handle connection logic here (e.g., logging, storing connection details)

    const message = `Connected to WebSocket.`

    return NextResponse.json(
      {
        message,
        ipAddress,
        connectionId,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}