// Externals
import { FC } from 'react'
// Locals
import { RadioOrCheckboxInput } from '@/components/Input'
// Styles
import styles from '@/app/page.module.css'



type CreateParticipantModalProps = {
  onClick: (e: any) => void
  onChange: {
    onNameChange: (e: any) => void
    onEmailChange: (e: any) => void
    onNobelLaureateChange: (e: any) => void
  }

}


const TITLE = `Enter the full name of the participant you want to add:`
const BUTTON_TEXT = `Create Participant`

const inputs = [
  { 
    name: `name`,
    placeholder: `Name`,
  },
  { 
    name: `email`,
    placeholder: `Email`,
  }
]



const CreateParticipantModal: FC<CreateParticipantModalProps> = ({
  onClick,
  onChange,
}) => {
  return (
    <>
      <div>
        {/* Title */}
        <div>
          <h2>{ TITLE }</h2>
        </div>

        {/* Inputs */}
        { inputs.map((input, i: number) => (
          <>
            <div>
              <input
                required
                type={ 'text' }
                name={ input.name }
                // className=''
                // style={  }
                // id={ `${ i }` }
                placeholder={ input.placeholder }
                onChange={ 
                  i === 0 ? onChange.onNameChange : onChange.onEmailChange 
                }
              />
            </div>
          </>
        )) }

        {/* Check box */}
        <input
          required
          type='checkbox'
          name={ 'is-nobel-laureate' }
          // className=''
          // style={  }
          // id={ `${ i }` }
          onChange={ onChange.onNobelLaureateChange }
        />

        {/* Button */}
        <button
          // style={{ }}
          onClick={ onClick }
          className={ styles.button }
        >
          { BUTTON_TEXT }
        </button>
      </div>
    </>
  )
}


export default CreateParticipantModal