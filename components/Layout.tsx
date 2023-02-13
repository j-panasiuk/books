import type { PropsWithChildren } from 'react'
import { Flex, Grid, GridItem } from '@chakra-ui/react'

export type LayoutProps = PropsWithChildren<HeaderProps>

export function Layout({ children, nav, actions }: LayoutProps) {
  return (
    <Grid
      w="100vw"
      h="100vh"
      templateRows="3rem 1fr"
      templateColumns="1fr"
      overflowX="hidden"
      overflowY="hidden"
    >
      <GridItem as="header">
        <Header nav={nav} actions={actions} />
      </GridItem>
      <GridItem as="main" overflowY="auto">
        {children}
      </GridItem>
    </Grid>
  )
}

export function scrollToTop() {
  document
    .getElementsByTagName('main')
    .item(0)
    ?.scrollTo({ top: 0, behavior: 'auto' })
}

type HeaderProps = {
  nav?: JSX.Element
  actions?: JSX.Element
}

function Header({ nav, actions }: HeaderProps) {
  return (
    <Flex
      p="relative"
      w="100%"
      h="100%"
      pr={2}
      bg="twitter.800"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex>{nav}</Flex>
      <Flex>{actions}</Flex>
    </Flex>
  )
}
