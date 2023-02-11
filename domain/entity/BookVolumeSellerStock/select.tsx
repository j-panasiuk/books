import { type SelectProps, Select } from '@chakra-ui/react'
import { type Stock, stockOptions, isStock } from 'domain/attribute/stock'

interface Props extends Omit<SelectProps, 'onSelect'> {
  value?: Stock
  onSelect: (stock?: Stock) => void
}

export function SellerStockSelect({ onSelect, ...props }: Props) {
  return (
    <Select
      placeholder=" "
      {...props}
      onChange={({ target: { value } }) => {
        const stock = isStock(value) ? value : undefined
        onSelect(stock)
      }}
    >
      {stockOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
  )
}
