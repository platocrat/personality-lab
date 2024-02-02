
/**
 * @dev "Will render a div element with the class name of my-class and a p 
 * element inside it containing the text" - See `[SheCodes - Why Use className in React](https://www.shecodes.io/athena/10217-why-use-classname-in-react-components#:~:text=Unlike%20regular%20HTML%2C%20in%20React,a%20reserved%20keyword%20in%20JavaScript.&text=This%20code%20will%20render%20a,the%20text%20%22Hello%20World%22.)
 */
const HCaptcha = () => {
  return (
    <>
      <div className='h-captcha' data-sitekey='your_site_key'></div>
    </>
  )
}