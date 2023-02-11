import type { PropsWithChildren } from 'react'
import { FormLabel, Text } from '@chakra-ui/react'

type Props = PropsWithChildren<{
  htmlFor: string
  label: string | JSX.Element
  icon: string | JSX.Element
}>

export function Labelled({ children, htmlFor, label, icon }: Props) {
  return (
    <>
      <FormLabel
        htmlFor={htmlFor}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        height={10}
        margin={0}
      >
        {typeof label === 'string' ? <Text>{label}</Text> : label}
        {typeof icon === 'string' ? <Text>{icon}</Text> : icon}
      </FormLabel>
      {children}
    </>
  )
}
