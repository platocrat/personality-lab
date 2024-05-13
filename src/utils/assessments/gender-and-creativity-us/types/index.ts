// Locals
import { 
  Religion,
  Gender__GACUsGender,
  MaritalStatus__GACUsGender,
  CurrentEmploymentStatus__GACUsGender,
  HighestLevelOfEducation__GACUsGender,
} from './enums'
import { RaceOrEthnicity, YesOrNo } from '@/utils'


type InputLabelEnumType = typeof YesOrNo 
  | typeof Religion 
  | typeof RaceOrEthnicity 
  | typeof Gender__GACUsGender 
  | typeof MaritalStatus__GACUsGender 
  | typeof CurrentEmploymentStatus__GACUsGender 
  | typeof HighestLevelOfEducation__GACUsGender




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