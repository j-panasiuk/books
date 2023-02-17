import { type BoxProps, Box, Img, type ImgProps } from '@chakra-ui/react'
import { type Stock } from 'domain/attribute/stock'

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
    return <Box key={sellerName} {...defaultBoxProps} {...props} />
  }

  const { box, img } = getThemeProps(stock)

  return (
    <Box key={sellerName} padding={1} {...defaultBoxProps} {...box} {...props}>
      <Img src={sellerIcon} alt={sellerName} {...img} />
    </Box>
  )
}

const defaultBoxProps: BoxProps = {
  width: 7,
  height: 7,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'gray.100',
  borderRadius: 2,
}

const dashed: BoxProps = { borderStyle: 'dashed' }
const green: BoxProps = { borderColor: 'green.300' }
const red: BoxProps = { borderColor: 'red.300' }

const desaturated: ImgProps = { filter: 'grayscale(1)' }
const transparent: ImgProps = { opacity: 0.2 }

function getThemeProps(
  stock: Stock
): Partial<{ box: BoxProps; img: ImgProps }> {
  switch (stock) {
    case 'available': {
      return {
        box: { ...green },
      }
    }
    case 'available:last_chance': {
      return {
        box: { ...green, ...dashed },
      }
    }
    case 'available:cannot_deliver': {
      return {
        box: { ...red, ...dashed },
      }
    }
    case 'out_of_stock': {
      return {
        box: { ...red, ...dashed },
        img: { ...desaturated, ...transparent },
      }
    }
    case 'out_of_stock:notify_me': {
      return {
        box: { ...green, ...dashed },
        img: { ...desaturated, ...transparent },
      }
    }
    case 'none': {
      return {
        img: { ...desaturated, ...transparent },
      }
    }
  }
}
