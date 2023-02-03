import * as s from 'superstruct'
import { Prisma } from '@prisma/client'

export type ResponseError = {
  message: string
  name?: string
  cause?: unknown
  meta?: Record<string, unknown>
}

const responseErrorStruct = s.type({
  message: s.string(),
}) satisfies s.Describe<ResponseError>

export function isResponseError(val: unknown): val is ResponseError {
  return responseErrorStruct.is(val)
}

interface ResponseErrorWithStatus extends ResponseError {
  status: number
}

export function handleResponseError(err: unknown): ResponseErrorWithStatus {
  if (err instanceof Prisma.PrismaClientValidationError) {
    return {
      status: 400,
      name: err.name,
      cause: err.cause,
      message: err.message,
    }
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      status: 400,
      name: err.name,
      cause: err.cause,
      message: err.message,
      meta: err.meta,
    }
  }
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      status: 500,
      name: err.name,
      cause: err.cause,
      message: err.message,
    }
  }

  return {
    status: 500,
    name: 'Unexpected Server Error',
    cause: err instanceof Error ? err.cause : undefined,
    message: err instanceof Error ? err.message : 'Something went wrong...',
  }
}
