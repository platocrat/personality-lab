import { definitelyCenteredStyle } from '@/theme/styles'
import { FC } from 'react'


type TitleType = {
  title: string
  isExample: boolean
}



const Title: FC<TitleType> = ({
  title,
  isExample,
}) => {
  return (
    <>
      { !isExample 
        && (
          <h3
            style={{
              ...definitelyCenteredStyle,
              // margin: '8px 0px 24px 0px',
            }}
          >
            { title }
          </h3>
        )
      }
    </>
  )
}

export default Title