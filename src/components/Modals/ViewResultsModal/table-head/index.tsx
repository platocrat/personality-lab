// Externals
import { FC } from 'react'
// Locals
import styles from '@/app/page.module.css'


type ViewResultsModalTableHeadProps = {

}


const tableHeaders = [
  'Assessment ID',
  'ID',
  'Date',
  'View?'
]




const ViewResultsModalTableHead: FC<ViewResultsModalTableHeadProps> = ({

}) => {
  return (
    <>
      <thead
        style={ {
          backgroundColor: '#f4f4f4',
        } }
      >
        <tr>
          { tableHeaders.map((name: string) => (
            <>
              <th
                style={ {
                  fontSize: '14px',
                  padding: '8px 24px',
                } }
              >
                { name }
              </th>
            </>
          )) }
        </tr>
      </thead>
    </>
  )
}


export default ViewResultsModalTableHead