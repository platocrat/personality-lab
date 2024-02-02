import { FC } from 'react'


type HCaptchaScriptProps = {}


const HCaptchaScript: FC<HCaptchaScriptProps> = ({}) => {
  return (
    <>
      <script src='https://js.hcaptcha.com/1/api.js' async defer></script>
    </>
  )
}


export default HCaptchaScript