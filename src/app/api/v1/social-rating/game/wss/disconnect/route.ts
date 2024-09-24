/* /api/v1/social-rating/game/wss/disconnect/route.ts */
// Externals
import { NextRequest, NextResponse } from 'next/server'



export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'POST') {
    const apiGatewayApiId = req.headers.get('x-amzn-apigateway-api-id')
    const traceId = req.headers.get('x-amzn-trace-id')

    console.log(
      `Client disconnected from API Gateway API ID '${
        apiGatewayApiId 
      }': AWS Trace ID - ${traceId}`
    )
    // Handle disconnection logic here (e.g., removing connection from database)

    const message = `Disconnected from WebSocket.`

    return NextResponse.json(
      {
        message,
        apiGatewayApiId,
        traceId,
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