import * as s from 'superstruct'
import { Prisma } from '@prisma/client'

export type ResponseError = {
  message: string
  name?: string
  cause?: unknown
  meta?: Record<string, unknown>
  failures?: s.Failure[]
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

export async function handleResponseError(
  err: unknown
): Promise<ResponseErrorWithStatus> {
  if (err instanceof s.StructError) {
    const failures = await err.failures()
    return {
      status: 400,
      name: err.name,
      cause: err.refinement,
      message: err.message,
      failures,
    }
  }

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

// --- EXTRACT FORM VALIDATION ERRORS ---

interface ValidationFailure<S extends object> extends s.Failure {
  key: keyof S
}

export function createResponseFormValidator<T, S extends object>(
  formErrorStruct: s.Struct<T, S>
) {
  function isValidationFailure(val: s.Failure): val is ValidationFailure<S> {
    return typeof val.key === 'string' && val.key in formErrorStruct.schema
  }

  return function getResponseFormErrors(err: unknown) {
    if (isResponseError(err) && err.failures) {
      const validationFailures = err.failures.filter(isValidationFailure)

      let formErrors: Partial<Record<keyof S, string>> = {}
      for (const { key, message } of validationFailures) {
        formErrors[key] = message
      }

      return formErrors
    }
  }
}
