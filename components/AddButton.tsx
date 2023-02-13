import { type ButtonProps, Button } from '@chakra-ui/react'

export function AddButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      variant="unstyled"
      width="100%"
      height="100%"
      borderWidth={4}
      borderColor="gray.100"
      borderStyle="dashed"
      color="blue.400"
      {...props}
    >
      {children}
    </Button>
  )
}
