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
      >
        <p style={ { textAlign: 'center', marginBottom: '8px' } }>
          { `Password must include the following:` }
        </p>
        <p id='ruleSymbol'>
          <span className='symbol' />
          { ` A symbol (e.g. #, ^, %)` }
        </p>
        <p id='ruleNumber'>
          <span className='symbol' />
          { ` A number (e.g. 3, 4, 5)` }
        </p>
        <p id='ruleCapital'>
          <span className='symbol' />
          { ` A capital letter (e.g. B, C, D)` }
        </p>
        <p id='ruleLowercase'>
          <span className='symbol' />
          { ` A lowercase letter (e.g. k, l, m)` }
        </p>
        <p id='ruleLength'>
          <span className='symbol' />
          { ` Minimum 13 characters` }
        </p>
      </div>
    </>
  )
}

export default PasswordValidation