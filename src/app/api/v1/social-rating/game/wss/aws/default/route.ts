/* /api/v1/social-rating/game/wss/aws/default/route.ts */
// Externals
import { NextRequest, NextResponse } from 'next/server'



export async function POST(
  req: NextRequest, 
  res: NextResponse
) {
  if (req.method === 'POST') {
    try {
      // Parse the WebSocket message
      const { action, data } = await req.json()

      if (!action || action === 'unknownAction') {
        const error = `Unknown action: ${action}`

        return NextResponse.json(
          { 
            error,
          },
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      } else {
        // Handle the default action
        console.log(
          `$default route received: action - ${action}, data - ${JSON.stringify(data)}`
        )

        const message = 'No specific route matched. Default handler processed this request.'

        // You can process the message here, log it, or respond with an error
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
      }
    } catch (error: any) {
      // Something went wrong
      const errorMessage = 'Failed to process $default route'
      console.error(errorMessage, error)

      return NextResponse.json(
        { 
          error: `${ errorMessage }: ${ error }`,
        },
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json' 
          },
        }
      )
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { 
        status: 405, 
        headers: { 
          'Content-Type': 'application/json' 
        },
      }
    )
  }
}
