// Externals
import { FC, Fragment } from 'react'
// Locals
import { tdOrThStyle } from '..'



type ParticipantTableHeadProps = {

}



const TABLE_HEADERS = [
  `ID`,
  `Username`,
  `Email`,
  `Observer Response`,
  `Observer Results`,
]



const ParticipantTableHead: FC<ParticipantTableHeadProps> = ({

}) => {
  return (
    <>
      <thead
        style={ {
          backgroundColor: '#f4f4f4',
        } }
      >
        { TABLE_HEADERS.map((name: string, i: number) => (
          <Fragment key={ i }>
            <th style={ tdOrThStyle }>
              <p>
                { name }
              </p>
            </th>
          </Fragment>
        )) }
      </thead>
    </>
  )
}


export default ParticipantTableHead