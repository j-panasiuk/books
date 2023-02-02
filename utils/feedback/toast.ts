import type { UseToastOptions } from '@chakra-ui/react'

export const toastSuccess: UseToastOptions = {
  status: 'success',
  position: 'top',
  duration: 3000,
}

export const toastError: UseToastOptions = {
  status: 'error',
  position: 'top',
  duration: 6000,
}
