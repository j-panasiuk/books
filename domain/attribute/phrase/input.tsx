import { Input, type InputProps } from '@chakra-ui/react'

export function PhraseInput(props: InputProps) {
  return <Input size="sm" type="search" placeholder="Phrase..." {...props} />
}
