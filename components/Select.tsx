import { type SelectProps, Select as ChakraSelect } from '@chakra-ui/react'
import { useMemo } from 'react'
import { getOptionLabel } from 'utils/forms/options'
import { isOneOf } from 'utils/isOneOf'

interface Props<Op extends string | undefined>
  extends Omit<SelectProps, 'onSelect'> {
  options: readonly Op[] | Op[]
  onSelect: (value: Op) => void
  value: Op
}

export function Select<Op extends string | undefined>({
  options,
  onSelect,
  value,
  ...props
}: Props<Op>) {
  const isOption = useMemo(() => isOneOf(options), [options])

  return (
    <ChakraSelect
      {...props}
      value={value || ''}
      onChange={(ev) => {
        const value = ev.target.value
        if (isOption(value)) {
          onSelect(value)
        }
      }}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {getOptionLabel(option)}
        </option>
      ))}
    </ChakraSelect>
  )
}
