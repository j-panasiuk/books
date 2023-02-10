import { UseToastOptions } from '@chakra-ui/react'
import { isResponseError } from 'utils/api/response'

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

export function getErrorToastDescription(err: unknown) {
  if (isResponseError(err) || err instanceof Error) {
    return err.name
  }
}
