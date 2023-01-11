import type { PropsWithChildren } from 'react'
import NextLink from 'next/link'
import { Flex, Grid, GridItem, Link } from '@chakra-ui/react'

type LayoutProps = PropsWithChildren<{
  actions?: JSX.Element
}>

export function Layout({ children, actions }: LayoutProps) {
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
        <Header actions={actions} />
      </GridItem>
      <GridItem as="main" overflowY="auto">
        {children}
      </GridItem>
    </Grid>
  )
}

function Header({ actions }: Pick<LayoutProps, 'actions'>) {
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
      <NextLink href="/" passHref>
        <Link
          mx={3}
          display="flex"
          alignItems="center"
          fontWeight={800}
          color="white"
        >
          Books
        </Link>
      </NextLink>
      <Flex>{actions}</Flex>
    </Flex>
  )
}
