// middleware.js
import { NextResponse } from 'next/server'
import { withMiddlewareAuthRequired, getSession } from '@auth0/nextjs-auth0/edge'
import { COOKIE_NAME } from './utils'


export default withMiddlewareAuthRequired(async function middleware(req) {
  const res = NextResponse.next()
  const user = await getSession(req, res)

  console.log(`user?.user: `, user?.user)
  
  res.cookies.set(COOKIE_NAME, JSON.stringify(user?.user))
  
  return res
})