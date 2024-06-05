// Externals
import { Dispatch, FC, SetStateAction } from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas'
// Locals
import { imgPaths } from '@/utils'
// CSS
import appStyles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import modalStyle from '@/components/Modals/Modal.module.css'



type ResultsVisualizationModalProps = {
  screenshotUrl: string
  refs: {
    modalRef: any
    screenshot2Ref: any
  }
  state: {
    isCopied: boolean
    setIsCopied: Dispatch<SetStateAction<boolean>>
    isModalVisible: boolean
  }
  viz: {
    visualizations: any[]
    currentVisualization: number
  }
}



const ResultsVisualizationModal: FC<ResultsVisualizationModalProps> = ({
  viz,
  refs,
  state,
  screenshotUrl,
}) => {
  const title = `Share Your Results!`


  const handleShareScreenshot = () => {
    const timeout = 2_000 // 2 seconds
    const viz_ = viz.visualizations[viz.currentVisualization]

    // Ask the user if they want to download the screenshot
    const alertMessage = `Download PNG of the ${viz_.name}?`
    const userConfirmation = window.confirm(alertMessage)

    if (userConfirmation && refs.screenshot2Ref.current) {
      html2canvas(refs.screenshot2Ref.current).then((canvas: any) => {
        canvas.toBlob((blob: any) => {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')

          state.setIsCopied(true)

          link.href = url
          link.download = `bessi-${viz_.imgName}.png`

          document.body.appendChild(link)

          link.click()

          // Cleanup: remove the link and revoke the object URL after download
          document.body.removeChild(link)
          URL.revokeObjectURL(url)

          setTimeout(() => {
            state.setIsCopied(false)
          }, timeout)
        })
      })
    }
  }



  return (
    <>
      { state.isModalVisible && (
        <>
          <div style={ definitelyCenteredStyle }>
            <div 
              ref={ refs.modalRef }
              className={ `${ modalStyle.modal } ${ modalStyle.background }` }
            >
              <h3
                style={{
                  ...definitelyCenteredStyle,
                  margin: '8px 0px 24px 0px',
                }}
              >
                  { title }
              </h3>

              <div ref={ refs.screenshot2Ref }>
                <Image
                  width={ 200 }
                  height={ 200 }
                  src={ screenshotUrl }
                  alt='Screenshot of Visualization'
                  style={ { width: '100%',  height: 'auto'  } } 
                />

                {/**
                  * @todo Add user metadata of strengths and things to highlight 
                  * to them to make the image more engaging to others who may view
                  * it.  
                  */}
                {/* User Metadata section */}
                <div
                  style={{
                    ...definitelyCenteredStyle,
                    flexDirection: 'column'
                  }}
                >
                  {/* <div 
                    style={{
                      margin: '12px 0px 24px 0px'
                    }}
                  >
                    <h3>{ `User Metadata` }</h3>
                    <p>{ `Name: ${'name'}` }</p>
                    <p>{ `Strengths: ${'strengths'}` }</p>
                  </div> */}
                </div>
              </div>

              <div style={definitelyCenteredStyle}>
                { state.isCopied ? (
                  <>
                    <div
                      style={{ 
                        ...definitelyCenteredStyle,
                        borderRadius: '1rem',
                        borderWidth: '1.2px',
                        width: '50px',
                        height: '36px',
                        backgroundColor: state.isCopied 
                          ? 'rgb(18, 215, 67)' 
                          : '',
                      }}
                    >
                      <Image
                        width={ 22 }
                        height={ 22 }
                        alt='Share icon to share data visualization'
                        src={ `${imgPaths().svg}white-checkmark.svg` }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      className={ appStyles.button }
                      onClick={ handleShareScreenshot }
                      style={ {
                        width: '50px',
                        height: '36px',
                        padding: '6px 0px 0px 0px',
                      } }
                    >
                      <Image
                        width={ 22 }
                        height={ 22 }
                        alt='Share icon to share data visualization'
                        src={ `${imgPaths().svg}download-image.svg` }
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) }
    </>
  )
}


export default ResultsVisualizationModal