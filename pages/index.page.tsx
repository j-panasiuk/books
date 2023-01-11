import { Button } from '@chakra-ui/react'
import { Layout } from 'components/Layout'

export default function IndexPage() {
  return <Layout actions={<Button size="sm">+ Add book</Button>}>Books</Layout>
}
