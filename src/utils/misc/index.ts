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