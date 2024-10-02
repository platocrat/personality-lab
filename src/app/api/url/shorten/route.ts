// Externals
import {
  PutCommand,
  PutCommandInput,
} from '@aws-sdk/lib-dynamodb'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { ddbDocClient, DYNAMODB_TABLE_NAMES } from '@/utils'



export async function PUT(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'PUT') {
    const { originalUrl } = await req.json()

    const TableName = DYNAMODB_TABLE_NAMES.shortUrls

    // Generate a unique shortId (e.g., 7-character string)
    const shortId = crypto.randomBytes(4).toString('hex')    

    // Return the short URL
    const origin = req.headers.get('origin')
    const shortenedUrl = `${origin}/api/url/${shortId}`

    const Item = {
      shortId,
      originalUrl,
    }

    const input: PutCommandInput = { TableName, Item }
    const command = new PutCommand(input)

    try {
      const response = await ddbDocClient.send(command)

      return NextResponse.json(
        {
          shortenedUrl,
        },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error: any) {
      // Something went wrong
      return NextResponse.json(
        { error: error },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
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
          'Content-Type': 'application/json',
        },
      },
    )
  }
}