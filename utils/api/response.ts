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
  console.log('handleResponseError', err)
  if (err instanceof Error) {
    // Handle known error types
    if (err instanceof s.StructError) {
      const failures = await err.failures()
      return {
        status: 400,
        name: s.StructError.name,
        cause: err.refinement,
        message: err.message,
        failures,
      }
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
      return {
        status: 400,
        name: Prisma.PrismaClientValidationError.name,
        cause: err.cause,
        message: err.message,
      }
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        status: 400,
        name: Prisma.PrismaClientKnownRequestError.name,
        cause: err.code,
        message: err.message,
        meta: err.meta,
      }
    }
    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
      return {
        status: 500,
        name: Prisma.PrismaClientUnknownRequestError.name,
        cause: err.cause,
        message: err.message,
      }
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

export function createResponseFormValidator<T, S extends object>(
  formErrorStruct: s.Struct<T, S>
) {
  function isValidationError(err: unknown): err is ValidationError<S> {
    return (
      isResponseError(err) &&
      Array.isArray(err.failures) &&
      err.failures.some(isValidationFailure)
    )
  }

  function isValidationFailure(val: s.Failure): val is ValidationFailure<S> {
    return typeof val.key === 'string' && val.key in formErrorStruct.schema
  }

  function isConstraintError(val: unknown): val is ConstraintError<S> {
    return (
      constraintErrorStruct.is(val) &&
      val.meta.target.some((key) => key in formErrorStruct.schema)
    )
  }

  return function getResponseFormErrors(err: unknown) {
    if (isValidationError(err)) {
      const validationFailures = err.failures.filter(isValidationFailure)

      let formErrors: Partial<Record<keyof S, string>> = {}
      for (const { key, message } of validationFailures) {
        formErrors[key] = message
      }
      return formErrors
    }
    if (isConstraintError(err)) {
      let formErrors: Partial<Record<keyof S, string>> = {}
      for (const key of err.meta.target) {
        formErrors[key] = err.message
      }
      return formErrors
    }
  }
}

interface ValidationError<S extends object> extends ResponseError {
  failures: ValidationFailure<S>[]
}

interface ValidationFailure<S extends object> extends s.Failure {
  key: keyof S
  message: string
}

interface ConstraintError<S extends object> extends ResponseError {
  message: string
  meta: {
    target: (keyof S)[]
  }
}

const constraintErrorStruct = s.type({
  message: s.string(),
  meta: s.type({
    target: s.array(s.string()),
  }),
})
