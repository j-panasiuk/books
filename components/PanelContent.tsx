import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
} from '@chakra-ui/react'

type Props = {
  children: JSX.Element
  header: JSX.Element
  actions?: JSX.Element
  close: () => void
}

export function PanelContent({ children, header, actions, close }: Props) {
  return (
    <>
      <DrawerHeader>{header}</DrawerHeader>
      <DrawerBody>{children}</DrawerBody>
      <DrawerFooter justifyContent="space-between">
        <Button size="sm" onClick={close}>
          Cancel
        </Button>
        {actions}
      </DrawerFooter>
    </>
  )
}
