import { useEffect } from 'react'


export default function useEnterKeyClick(ref) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') ref.current.click()
    }

    const ref_ = ref.current

    ref_.addEventListener('keypress', handleKeyPress)

    return () => {
      ref_.removeEventListener('keypress', handleKeyPress)
    }
  }, [ref])
}