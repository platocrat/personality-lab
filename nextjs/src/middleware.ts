// middleware.js
import { withMiddlewareAuthRequired, getSession } from '@auth0/nextjs-auth0/edge'
import { NextResponse } from 'next/server'
import { COOKIE_NAME } from './utils'

export default withMiddlewareAuthRequired(async function middleware(req) {
  const res = NextResponse.next()
  const user = await getSession(req, res)

  console.log(
    `[${ new Date().toLocaleString() } --filepath="src/middleware.ts" --function="middleware()"]: user: `, 
    user
  )

  const stringifiedUserObj = JSON.stringify(user?.user)
  
  res.cookies.set(COOKIE_NAME, stringifiedUserObj)
  
  return res
})