// Externals
import Image from 'next/image'
import html2canvas from 'html2canvas'
// Locals
import { imgPaths } from '@/utils'
// CSS
import appStyles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import modalStyle from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization/modal/modal.module.css'



const Modal = ({
  modalRef,
  isCopied,
  setIsCopied,
  screenshotUrl,
  isModalVisible,
  screenshot2Ref,
  visualizations,
  currentVisualization,
}) => {
  const title = `Share Your Results!`


  const handleShareScreenshot = () => {
    const timeout = 2_000 // 2 seconds
    const viz = visualizations[currentVisualization]

    // Ask the user if they want to download the screenshot
    const alertMessage = `Download PNG of the ${viz.name}?`
    const userConfirmation = window.confirm(alertMessage)

    if (userConfirmation && screenshot2Ref.current) {
      html2canvas(screenshot2Ref.current).then((canvas: any) => {
        canvas.toBlob((blob: any) => {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')

          setIsCopied(true)

          link.href = url
          link.download = `bessi-${viz.imgName}.png`

          document.body.appendChild(link)

          link.click()

          // Cleanup: remove the link and revoke the object URL after download
          document.body.removeChild(link)
          URL.revokeObjectURL(url)

          setTimeout(() => {
            setIsCopied(false)
          }, timeout)
        })
      })
    }
  }



  return (
    <>
      { isModalVisible && (
        <>
          <div 
            ref={ modalRef }
            className={ `${ modalStyle.modal } ${ modalStyle.background }` }
          >
            <h2 
              style={{
                ...definitelyCenteredStyle,
                margin: '0px 0px 24px 0px',
              }}
            >
                { title }
            </h2>

            <div ref={ screenshot2Ref }>
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
              <button
                className={ appStyles.button }
                onClick={ handleShareScreenshot }
                style={ {
                  width: '60px',
                  padding: '6px 0px 0px 0px',
                  backgroundColor: isCopied ? 'rgb(18, 215, 67)' : ''
                } }
              >
                <Image
                  width={ 18 }
                  height={ 18 }
                  alt='Share icon to share data visualization'
                  src={
                    isCopied
                      ? `${imgPaths().svg}white-checkmark.svg`
                      : `${imgPaths().svg}white-share-icon.svg`
                  }
                />
              </button>
            </div>
          </div>
        </>
      ) }
    </>
  )
}


export default Modal