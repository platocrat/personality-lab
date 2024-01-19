'use client';


const PasswordValidation = () => {
  return (
    <>
      <div
        style={ {
          display: 'grid',
          fontSize: '13.5px',
          gap: '4px',
          marginTop: '8px',
          marginBottom: '24px',
        } }
        id='passwordRules'
      >
        <p style={ { textAlign: 'center', marginBottom: '8px' } }>
          { `Password must include the following:` }
        </p>
        <p id='ruleNumber'>
          <span class='symbol' />
          { ` A number (e.g. 3)` }
        </p>
        <p id='ruleCapital'>
          <span class='symbol' />
          { ` A capital letter (e.g. B)` }
        </p>
        <p id='ruleLowercase'>
          <span class='symbol' />
          { ` A lowercase letter (e.g. k)` }
        </p>
        <p id='ruleLength'>
          <span class='symbol' />
          { ` Minimum 13 characters` }
        </p>
      </div>
    </>
  )
}

export default PasswordValidation