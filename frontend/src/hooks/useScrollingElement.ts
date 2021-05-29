import { useEffect } from 'react'

function scrollingElement() {
    return document.documentElement
    // return document.scrollingElement || document.documentElement
}

export function useScrollingElement(trigger: any) {
  useEffect(() => {
    if (trigger) {
      scrollingElement().style.overflow = 'hidden'
      document.body.style.touchAction = 'unset'
    } else {
      scrollingElement().style.overflow = 'auto'
      document.body.style.touchAction = 'manipulation'
    }
  }, [trigger])
}
