import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Text } from '@chakra-ui/react'
import { type LayoutProps, Layout } from 'components/Layout'
import { T } from 'utils/translate'

export function AppLayout(props: LayoutProps) {
  return <Layout nav={<AppNav />} {...props} />
}

const links = [
  { href: '/', label: T('Home') },
  { href: '/books', label: T('Books') },
] as const

function AppNav() {
  const router = useRouter()

  return (
    <>
      {links.map(({ href, label }) => (
        <NextLink key={href} href={href}>
          <Text
            mx={3}
            display="flex"
            alignItems="center"
            fontWeight={800}
            color={router.asPath === href ? 'white' : 'whiteAlpha.700'}
          >
            {label}
          </Text>
        </NextLink>
      ))}
    </>
  )
}
