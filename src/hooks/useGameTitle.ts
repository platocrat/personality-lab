import { useLayoutEffect, useState } from 'react'


export default function useGameTitle(
  gameId: string, 
  sessionId: string,
): string {
  const [ gameTitle, setGameTitle ] = useState<string>('')


  async function getGameTitle(): Promise<void> {
    let title = ''

    switch (gameId) {
      case 'bessi':
        title = 'The BESSI'
        break
      case 'fictional-characters':
        title = 'Gen AI Fictional Characters'
        break
      default:
        title = 'No game ID was found'
        break
    }

    setGameTitle(title)
  }


  useLayoutEffect(() => {
    if (gameId && sessionId) {
      const requests = [
        getGameTitle(),
      ]

      Promise.all(requests).then(() => { })
    }
  }, [ gameId, sessionId ])


  return gameTitle
}