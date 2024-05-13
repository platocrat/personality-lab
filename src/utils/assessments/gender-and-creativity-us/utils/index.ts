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