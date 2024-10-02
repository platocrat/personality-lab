/* /api/v1/social-rating/game/wss/aws/connect/route.ts */
// Externals
import { NextRequest, NextResponse } from 'next/server'



export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'POST') {
    const apiGatewayApiId = req.headers.get('x-amzn-apigateway-api-id')
    const traceId = req.headers.get('x-amzn-trace-id')
    const ipAddress = req.headers.get('x-forwarded-for')

    console.log(
      `Client connected from API Gateway API ID '${ 
        apiGatewayApiId 
      }': Trace ID - ${traceId}, IP - ${ipAddress}`
    )
    // Handle connection logic here (e.g., logging, storing connection details)

    const message = `Connected to WebSocket.`

    return NextResponse.json(
      {
        message,
        ipAddress,
        traceId,
        apiGatewayApiId,
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