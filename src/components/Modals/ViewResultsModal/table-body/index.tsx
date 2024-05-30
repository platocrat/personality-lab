// Externals
import { FC, Fragment } from 'react'
// Locals
// Types
import { ResultsToViewType } from '..'
// CSS
import styles from '@/app/page.module.css'



type ViewResultsModalTableBodyProps = {
  allUserResults: ResultsToViewType[]
  onViewResultsChange: (
    e: any, 
    study: { 
      name: string
      assessmentId: string 
    }
  ) => void
}



const ViewResultsModalTableBody: FC<ViewResultsModalTableBodyProps> = ({
  allUserResults,
  onViewResultsChange,
}) => {
  return (
    <>
      <tbody>
        { allUserResults.map((_: ResultsToViewType, i: number) => (
          <Fragment key={ i }>
            <tr
              key={ i }
              className={ styles.radioButtonLabel }
              onClick={
                (e: any) => {
                  if (e.target.type !== 'checkbox') {
                    // Ensure that checkbox is toggled when 
                    // `tr` element is clicked.
                    e.preventDefault()

                    const checkbox = e.currentTarget.querySelector(
                      "input[type='checkbox']"
                    )

                    checkbox.checked = !checkbox.checked

                    // Call `onChange` handler to select the 
                    // results to view
                    onViewResultsChange(e, _.study)
                  }
                }
              }
              style={ {
                cursor: 'pointer',
                marginBottom: '8px',
                fontSize: '14px',
                border: '0.75px solid gray',
              } }
            >
              <td
                style={ {
                  width: '125px',
                  padding: '4px 0px',
                } }
              >
                { _.study.assessmentId }
              </td>
              <td
                style={ {
                  width: '125px',
                } }
              >
                { _.id.slice(0, 8) + '...' }
              </td>
              <td
                style={ {
                  width: '175px',
                } }
              >
                { _.timestamp }
              </td>

              <td>
                <input
                  required
                  type='checkbox'
                  name={ 'select' }
                  style={ {
                    top: '2px',
                    cursor: 'pointer',
                    position: 'relative',
                  } }
                  onChange={
                    (e: any) => {
                      e.stopPropagation()
                      onViewResultsChange(e, _.study)
                    }
                  }
                />
              </td>
            </tr>
          </Fragment>
        )) }
      </tbody>
    </>
  )
}


export default ViewResultsModalTableBody