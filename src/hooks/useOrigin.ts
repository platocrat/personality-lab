import { useState, useLayoutEffect } from 'react'


export default function useOrigin(): string {
  const [ origin, setOrigin ] = useState<string>('')

  useLayoutEffect(() => {
    if (typeof window !== undefined) {
      const origin_ = window.location.origin
      setOrigin(origin_)
    }
  }, [ ])

  return origin
}