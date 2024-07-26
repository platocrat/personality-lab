import { InputLabelEnumType } from '../types'


export function getInputLabels(
  _enum: InputLabelEnumType | undefined,
  options?: {
    isEnum?: boolean
    input?: string[]
  }
): { id: string, name: string }[] {
  if (_enum === undefined) {
    return (options?.input as string[]).map(
      (key: string, i: number): { id: string, name: string } => {
        return {
          id: `${i}`,
          name: key
        }
      })
  } else {
    return Object.keys(_enum).map(
      (key: string): { id: string, name: string } => {
        const enum_ = (
          _enum[key as keyof typeof _enum] as InputLabelEnumType
        ).toString()

        return {
          id: enum_.toLocaleLowerCase(),
          name: enum_
        }
      })
  }
}


/**
 * ## Usage
 * ```
 * // Example array of strings
 * const keysArray = ['key1', 'key2', 'key3']
 * // Call the function to get items from local storage
 * const items = getItemsFromLocalStorage(keysArray)
 * ```
 */
export function getItemsFromLocalStorage(keysArray: string[]) {
  const items = {}
  
  keysArray.forEach((key: string): void => {
    items[key] = localStorage.getItem(key)
  })

  return items
}