'use client'

// Externals
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CSSProperties, FC, ReactNode, startTransition } from 'react'
// Locals
import { useProgressBar } from '@/components/Progress/ProgressBar'



type ProgressBarLinkProps = {
  href: string
  children: ReactNode
  style?: CSSProperties
  className?: string
}



const ProgressBarLink: FC<ProgressBarLinkProps> = ({
  href,
  style,
  children,
  className,
}) => {
  let router = useRouter()
  let { start, done } = useProgressBar()


  return (
    <Link
      href={ href }
      style={ style }
      className={ className }
      onClick={ (e) => {
        e.preventDefault()
        start()

        startTransition(() => {
          done()
          router.push(href)
        })
      } }
    >
      { children }
    </Link>
  )
}


export default ProgressBarLink