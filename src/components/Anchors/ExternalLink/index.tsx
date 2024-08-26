// Externals
import { FC } from 'react'
// Locals
import styles from '@/app/page.module.css'


type ExternalLinkProps = {
  linkText: string
  href?: string
  options?: {
    target?: string
  }
}



function stripDash(number: string): string {
  // Use the replace() method with a regular expression to remove all dashes
  return number.replace(/-/g, '')
}


function getHref(_: string): string {
  // Check if the _ is a phone number (contains only digits and optionally '-'
  if (/^\d+$/.test(_.replace(/-/g, ''))) {
    return `tel:+1${_.replace(/-/g, '')}`
  } else if (_.includes('@')) {
    // Assume it's an email address if it contains '@' symbol
    return `mailto:${_}`
  } else {
    // Invalid _
    return _
  }
}





const ExternalLink: FC<ExternalLinkProps> = ({
  linkText,
  href,
  options,
}) => {
  const _href = getHref(linkText)


  return (
    <>
      <a
        href={ href ?? _href }
        className={ styles.externalLink }
        target={ options?.target }
      >
        { linkText }
      </a>
    </>
  )
}


export default ExternalLink