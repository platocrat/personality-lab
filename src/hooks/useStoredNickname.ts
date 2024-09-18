import { useState, useLayoutEffect } from 'react'

type StoredNickname = {
  nickname: string
  isPlayer: boolean
}

export default function useStoredNickname(): StoredNickname {
  const [nickname, setNickname] = useState<string>('')
  const [isPlayer, setIsPlayer] = useState<boolean>(false)

  
  useLayoutEffect(() => {
    const key = 'nickname'
    const storedNickname = localStorage.getItem(key)

    if (storedNickname) {
      setNickname(storedNickname)
      setIsPlayer(true)
    }
  }, [ ])

  return { nickname, isPlayer }
}