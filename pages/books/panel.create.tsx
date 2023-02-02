import { useState } from 'react'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
} from '@chakra-ui/react'
import type { Book, Prisma } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import type { Create } from 'domain/entity/api'
import type { PanelControls } from 'utils/interaction/panel'
import { PanelContent } from 'components/PanelContent'

interface Props extends PanelControls<Serialized<Book>> {
  create: Create<Serialized<Book>>
}

export function BookPanelCreate({
  closePanel,
  openCreatePanel,
  openUpdatePanel,
  create,
}: Props) {
  const [bookInput, setBookInput] = useState<Prisma.BookCreateInput>({
    author: '',
    title: '',
    suggestedBy: '',
  })

  const onSave = (): Promise<Serialized<Book>> => {
    try {
      const { author, title, suggestedBy } = bookInput
      return create({ author, title, suggestedBy })
    } catch (err) {
      console.log('CREATE failed', err)
      return Promise.reject(err)
    }
  }

  const saveAndAddAnother = () => onSave().then(openCreatePanel)
  const saveAndEdit = () => onSave().then(openUpdatePanel)
  const saveAndClose = () => onSave().then(closePanel)

  return (
    <PanelContent
      close={closePanel}
      header={<>Add book</>}
      actions={
        <ButtonGroup size="sm" colorScheme="blue">
          <Button onClick={saveAndAddAnother} variant="outline">
            Save and add another
          </Button>
          <Button onClick={saveAndEdit} variant="outline">
            Save and edit
          </Button>
          <Button onClick={saveAndClose}>Save</Button>
        </ButtonGroup>
      }
    >
      <SimpleGrid columns={3} gridGap={2}>
        <FormControl>
          <FormLabel htmlFor="author">Author</FormLabel>
          <Input
            id="author"
            type="text"
            onChange={(ev) => {
              setBookInput((input): Prisma.BookCreateInput => {
                return { ...input, author: ev.target.value }
              })
            }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            type="text"
            onChange={(ev) => {
              setBookInput((input): Prisma.BookCreateInput => {
                return { ...input, title: ev.target.value }
              })
            }}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="suggested_by">Suggested by</FormLabel>
          <Input
            id="suggested_by"
            type="text"
            onChange={(ev) => {
              setBookInput((input): Prisma.BookCreateInput => {
                const persons = ev.target.value.split(', ').filter(Boolean)
                const suggestedBy = persons.length
                  ? persons.join(', ')
                  : undefined
                return { ...input, suggestedBy }
              })
            }}
          />
        </FormControl>
      </SimpleGrid>
    </PanelContent>
  )
}
