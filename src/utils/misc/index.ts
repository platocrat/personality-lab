export function deleteAllCookies() {
  const cookies = document.cookie.split(";")

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf("=")
    const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }
}


export function getRandomValueInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}


// Function to find the nth occurrence of a substring
export function findNthOccurrence(str: string, substr: string, n: number): number {
  let index = -1
 
  for (let i = 0; i < n; i++) {
    index = str.indexOf(substr, index + 1)
    if (index === -1) {
      break
    }
  }
 
  return index
}