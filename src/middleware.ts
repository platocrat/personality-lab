// /* middleware.ts */
// // Externals
// import { NextResponse } from 'next/server'
// import { withMiddlewareAuthRequired, getSession } from '@auth0/nextjs-auth0/edge'
// // Locals
// import { COOKIE_NAME } from './utils'


// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - about (about page)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public (image folder)
//      * - invite (/invite/ page to register a participant to a study)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico|invite|public).*)',
//   ],
// }


// export default withMiddlewareAuthRequired(async function middleware(req) {
//   const res = NextResponse.next()
//   // const user = await getSession(req, res)

//   return res
// })



// -------------------------------- CURRENT ------------------------------------
// Externals
import { NextRequest } from 'next/server'



export async function middleware(req: NextRequest) {

} 