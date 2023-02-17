import type {
  AspectRatioProps,
  BackgroundProps,
  BoxProps,
  ColorProps,
} from '@chakra-ui/react'
import { AspectRatio, Text } from '@chakra-ui/react'
import { type BookVolumeCopy } from '.'

interface Props extends AspectRatioProps {
  copy: BookVolumeCopy
  title?: string
}

export function BookVolumeCopyCover({ copy, title, ...props }: Props) {
  const colors = getColors(copy)
  return (
    <AspectRatio
      minWidth={5}
      ratio={5 / 7}
      title={title}
      {...colors}
      {...props}
    >
      <Text fontWeight="bold">{title?.charAt(0)}</Text>
    </AspectRatio>
  )
}

function getCoverColors(
  copy: BookVolumeCopy
): Partial<{ backdrop: ColorProps['color']; stripes: ColorProps['color'] }> {
  switch (copy.ownership) {
    case 'borrowed': {
      return { backdrop: 'orange.300' }
    }
    case 'gifted': {
      return { backdrop: 'purple.300' }
    }
    case 'ordered': {
      return { backdrop: 'gray.300' }
    }
    case 'owned': {
      return copy.to
        ? { backdrop: 'gray.500', stripes: 'purple.300' }
        : { backdrop: 'gray.500' }
    }
  }
}

function getBackground(copy: BookVolumeCopy): BackgroundProps['background'] {
  const { backdrop, stripes } = getCoverColors(copy)

  if (stripes) {
    return `repeating-linear-gradient(
      -45deg,
      ${backdrop},
      ${backdrop} 7px,
      ${stripes} 7px,
      ${stripes} 14px
    )`
  }

  return backdrop
}

function getColor(copy: BookVolumeCopy): ColorProps['textColor'] {
  switch (copy.ownership) {
    case 'borrowed':
      return 'white'
    case 'gifted':
      return 'white'
    case 'owned':
      return 'white'
  }
}

function getColors(copy: BookVolumeCopy): BoxProps {
  return {
    background: getBackground(copy),
    color: getColor(copy),
  }
}
