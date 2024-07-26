// Externals
import { FC, Fragment } from 'react'
// Locals
import styles from '@/sections/main-portal/studies/view/list-of-studies/ListOfStudies.module.css'



type ParticipantTableHeadProps = {

}



const TABLE_HEADERS = [
  `ID`,
  // `Username`,
  `Email`,
  // `Observer Response`,
  // `Observer Results`,
]



const ParticipantTableHead: FC<ParticipantTableHeadProps> = ({

}) => {
  return (
    <>
      <thead>
        <tr>
          { TABLE_HEADERS.map((name: string, i: number) => (
            <Fragment key={ i }>
              <th>
                <p>
                  { name }
                </p>
              </th>
            </Fragment>
          )) }
        </tr>
      </thead>
    </>
  )
}


export default ParticipantTableHead