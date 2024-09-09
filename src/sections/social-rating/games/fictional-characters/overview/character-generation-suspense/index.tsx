// Externals
import { FC } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



const CharacterGenerationSuspense: FC<{ loading: boolean }> = ({
  loading,
}) => {
  const buttonText = `Generate Characters`


  return (
    <>
      { loading ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
            } }
          >
            <Spinner
              height={ '22' }
              width={ '22' }
              style={ { stroke: 'white' } }
            />
          </div>
        </>
      ) : (
        <>
          { buttonText }
        </>
      ) }
    </>
  )
}

export default CharacterGenerationSuspense