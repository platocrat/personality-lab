'use client'

import {
  FC,
  Fragment,
} from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Utils
import {
  STUDY__DYNAMODB,
  AVAILABLE_ASSESSMENTS,
} from '@/utils'
// CSS
import appStyles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import sectionStyles from '@/sections/main-portal/studies/create/CreateStudy.module.css'




type CreateStudyFormProps = {
  study: STUDY__DYNAMODB
  onSubmit: (e: any) => void
  onChangeHandlers: {
    handleChange: (e: any) => void
    handleAdminEmailChange: (e: any) => void
  }
  onClickHandlers: {
    addAdminEmail: () => void
    removeAdminEmail: (email: string) => void
  }
  states: {
    newAdminEmail: string
    isCreatingStudy: boolean
    newStudyCreated: boolean
    invalidEmailMessage: string | null
  }
}



const CreateStudyForm: FC<CreateStudyFormProps> = ({
  study,
  states,
  onSubmit,
  onClickHandlers,
  onChangeHandlers,
}) => {
  return (
    <>
      <form onSubmit={ onSubmit }>
        {/* Name of study */ }
        <div>
          <label>
            { `What is the name of your study?` }
          </label>
          <input
            required
            type='text'
            name='name'
            value={ study.name }
            onChange={ onChangeHandlers.handleChange }
            placeholder={ `My Personality Research Study #459` }
          />
        </div>
        {/* Description */ }
        <div>
          <label>
            { `Description:` }
          </label>
          <textarea
            required
            name='description'
            value={ study.details.description }
            onChange={ onChangeHandlers.handleChange }
            placeholder={
              `A study conducting research on personality behaviors.`
            }
          />
        </div>
        {/* Select an assessment */ }
        <div
          style={ {
            display: 'flex',
            justifyContent: 'space-between',
            margin: '12px 0px 24px 0px',
          } }
        >
          <label
            style={{
              position: 'relative',
              top: '4.5px',
            }}
          >
            { `Select an Assessment:` }
          </label>
          <select
            required
            name='assessmentId'
            value={ study.details.assessmentId }
            onChange={ onChangeHandlers.handleChange }
          >
            <option value=''>
              { `Select an assessment` }
            </option>
            { AVAILABLE_ASSESSMENTS.map((assessment, i: number) => (
              <option key={ i } value={ assessment.id }>
                { assessment.name }
              </option>
            )) }
          </select>
        </div>
        {/* Add admin emails */ }
        <div className='form-group'>
          <label>
            { `Add Admin Emails:` }
          </label>
          <input
            type='email'
            value={ states.newAdminEmail }
            onChange={ onChangeHandlers.handleAdminEmailChange }
            placeholder='johndoe@gmail.com'
          />
          { states.invalidEmailMessage &&
            <div className={ sectionStyles['error-message'] }>
              { states.invalidEmailMessage }
            </div>
          }
          <button
            type='button'
            style={{ marginTop: '-18px' }}
            onClick={ onClickHandlers.addAdminEmail }
            className={ sectionStyles['add-button'] }
          >
            { `Add` }
          </button>

          { study?.adminEmails?.length !== 0 && (
            <div
              style={ {
                marginTop: '12px',
                padding: '0px 24px',
              } }
            >
              <p
                style={ {
                  textAlign: 'left',
                  textDecoration: 'underline',
                } }
              >
                { `Admin emails` }
              </p>
              <ul>
                { study?.adminEmails?.map((email, index) => (
                  <Fragment key={ index }>
                    <ul
                      key={ index }
                      style={ {
                        display: 'flex',
                        padding: '5px 0',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      } }
                    >
                      <p>
                        { email }{ ' ' }
                      </p>
                      <button
                        type='button'
                        className={ sectionStyles['remove-button'] }
                        onClick={ 
                          () => onClickHandlers.removeAdminEmail(email)
                        }
                      >
                        { `Remove` }
                      </button>
                    </ul>
                  </Fragment>
                )) }
              </ul>
            </div>
          ) }
        </div>

        {/* Create study button */ }
        { states.isCreatingStudy || states.newStudyCreated ? (
          <>
            <div
              style={ {
                ...definitelyCenteredStyle,
                position: 'relative',
                marginTop: '24px',
              } }
            >
              <Spinner height='40' width='40' />
            </div>
          </>
        ) : (
          <>
            <div style={ { ...definitelyCenteredStyle } }>
              <button
                type='submit'
                style={ { width: '125px', marginTop: '24px' } }
                className={ appStyles.button }
              >
                { `Create Study` }
              </button>
            </div>
          </>
        ) }
      </form>
    </>
  )
}


export default CreateStudyForm

