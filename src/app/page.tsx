'use client'

// Externals
import { useLayoutEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import MainPortal from '@/sections/main-portal'

export default function Home() {
  const { user, error, isLoading  } = useUser()


  useLayoutEffect(() => {
    if (!isLoading) {
      console.log(
        `[${new Date().toLocaleString()} --filepath="src/app/page.tsx" --function="useLayoutEffect()"]: user: `,
        user
      )
      console.log(
        `[${new Date().toLocaleString()} --filepath="src/app/page.tsx" --function="useLayoutEffect()"]: error: `,
        error
      )
      console.log(
        `[${new Date().toLocaleString()} --filepath="src/app/page.tsx" --function="useLayoutEffect()"]: error.name: `,
        error?.name
      )
      console.log(
        `[${new Date().toLocaleString()} --filepath="src/app/page.tsx" --function="useLayoutEffect()"]: error.message: `,
        error?.message
      )
      console.log(
        `[${new Date().toLocaleString()} --filepath="src/app/page.tsx" --function="useLayoutEffect()"]: error.cause: `,
        error?.cause
      )
    }
  }, [ user, error, isLoading ])



  return (
    <>
      <main>
        <MainPortal />
      </main>
    </>
  )
}