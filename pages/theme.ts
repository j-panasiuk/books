import { extendTheme } from '@chakra-ui/react'

const breakpoints = {
  sm: '320px',
  md: '776px', // '768px',
  lg: '1144px', // '960px',
  xl: '1512px', // '1200px',
  '2xl': '1880px', // '1536px',
}

export const theme = extendTheme({
  breakpoints,
})
