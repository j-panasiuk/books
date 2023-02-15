import * as s from 'superstruct'
import { Code } from '@chakra-ui/react'
import { stringify } from 'utils/json'
import { T } from 'utils/translate'

type Props = {
  validStruct: s.Struct<any, unknown>
  formValues: object
}

export function JSONPreview({ validStruct, formValues }: Props) {
  const [error, values] = validStruct.validate(formValues)
  return error ? (
    <>
      <Code width="100%" padding={1} whiteSpace="pre">
        {String(error)}
      </Code>
      <Code width="100%" padding={1} background="red.100">
        {T('Found errors')}
      </Code>
    </>
  ) : (
    <>
      <Code width="100%" padding={1} whiteSpace="pre">
        {stringify(values)}
      </Code>
      <Code width="100%" padding={1} background="green.100">
        {T('All is well')}
      </Code>
    </>
  )
}
