import { InputLabelEnumType } from '../types'


export function getInputLabels(
  _enum: InputLabelEnumType
): { id: string, name: string }[] {
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