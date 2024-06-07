export const debounce = (fn: any, delay: number): ((...args: any) => void) => {
  let timer: any = null

  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}