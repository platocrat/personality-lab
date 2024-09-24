/* /api/v1/social-rating/game/ws/disconnect/route.ts */
// Externals
import { NextRequest, NextResponse } from 'next/server'



export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'POST') {
    const connectionId = req.headers.get('X-Amzn-Connection-Id')

    console.log(`Client disconnected: Connection ID - ${connectionId}`)
    // Handle disconnection logic here (e.g., removing connection from database)

    const message = `Disconnected from WebSocket.`

    return NextResponse.json(
      {
        message,
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