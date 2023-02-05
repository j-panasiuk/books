import { type BoxProps, Box, Img } from '@chakra-ui/react'
import { type Stock, canBuy } from 'domain/attribute/stock'

interface Props extends BoxProps {
  sellerName: string
  sellerIcon: string
  stock?: Stock
}

export function SellerStockIcon({
  sellerName,
  sellerIcon,
  stock,
  ...props
}: Props) {
  if (!stock) {
    return (
      <Box
        key={sellerName}
        {...defaultProps}
        borderColor="gray.100"
        {...props}
      />
    )
  }

  const isAvailable = canBuy(stock)
  return (
    <Img
      key={sellerName}
      src={sellerIcon}
      alt={sellerName}
      {...defaultProps}
      padding={1}
      borderColor="gray.500"
      opacity={isAvailable ? undefined : 0.25}
      filter={isAvailable ? undefined : 'grayscale(1)'}
      {...props}
    />
  )
}

const defaultProps: BoxProps = {
  width: 7,
  height: 7,
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: 2,
}
