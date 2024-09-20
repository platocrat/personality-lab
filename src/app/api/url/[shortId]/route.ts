// Externals
import { NextRequest, NextResponse } from 'next/server'
import { 
  GetCommand,
  GetCommandInput, 
} from '@aws-sdk/lib-dynamodb'
// Locals
import {
  ddbDocClient, 
  SHORT_URL__DYNAMODB,
  DYNAMODB_TABLE_NAMES, 
} from '@/utils'



export async function GET(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'GET') {
    const url = req.url
    
    const target = 'api/url/'
    const targetIndex = url.indexOf(target) + target.length
    const shortId = url.slice(targetIndex)

    const TableName = DYNAMODB_TABLE_NAMES.shortUrls
    const Key = { shortId }

    const input: GetCommandInput = { TableName, Key }
    const command = new GetCommand(input)

    try {
      const response = await ddbDocClient.send(command)

      if (response.Item as SHORT_URL__DYNAMODB) {
        const shortUrl = response.Item as SHORT_URL__DYNAMODB
        const originalUrl = shortUrl.originalUrl

        return NextResponse.redirect(originalUrl)
      } else {
        const message = `shortId '${shortId}' not foundin ${TableName} table`

        return NextResponse.json(
          {
            message,
          },
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json'
            }
          },
        )
      }
    } catch (error: any) {
      // Something went wrong
      return NextResponse.json(
        { error: error },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        },
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