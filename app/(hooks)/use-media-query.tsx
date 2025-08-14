import * as React from "react"

export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}

export function useBreakpoints() {
  const isSm = useMediaQuery("(min-width: 480px)")
  const isMd = useMediaQuery("(min-width: 768px)")
  const isLg = useMediaQuery("(min-width: 976px)")
  const isXl = useMediaQuery("(min-width: 1440px)")

  return {
    isSm,
    isMd,
    isLg,
    isXl,
  }
}