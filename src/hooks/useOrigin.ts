import { useState, useLayoutEffect } from 'react'


export default function useOrigin(email: string): string {
  const [ origin, setOrigin ] = useState<string>('')

  useLayoutEffect(() => {
    if (email && typeof window !== undefined) {
      const origin_ = window.location.origin
      setOrigin(origin_)
    }
  }, [ email ])

  return origin
}