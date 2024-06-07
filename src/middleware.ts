// middleware.js
import { withMiddlewareAuthRequired, getSession } from '@auth0/nextjs-auth0/edge'
import { NextResponse } from 'next/server'
import { COOKIE_NAME } from './utils'

export default withMiddlewareAuthRequired(async function middleware(req) {
  const res = NextResponse.next()
  // const user = await getSession(req, res)

  return res
})