import { useState } from 'react'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react'
import type { Book, Prisma } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import type { PanelCreateProps } from 'domain/entity/panel'
import { PanelContent } from 'components/PanelContent'
import { toastSuccess, toastError } from 'utils/feedback/toast'
import { getShorthand } from 'domain/entity/book/Book'

export function BookPanelCreate({
  initialValue,
  closePanel,
  openCreatePanel,
  openUpdatePanel,
  create,
}: PanelCreateProps<Serialized<Book>>) {
  const toast = useToast()
  const [bookInput, setBookInput] = useState<Prisma.BookCreateInput>({
    author: initialValue?.author || '',
    title: initialValue?.title || '',
    suggestedBy: initialValue?.suggestedBy || '',
  })

  const onSave = async (): Promise<Serialized<Book>> => {
    try {
      const { author, title, suggestedBy } = bookInput
      const created = await create({ author, title, suggestedBy })
      toast({
        ...toastSuccess,
        title: 'Created book',
        description: getShorthand(created),
      })
      return created
    } catch (err) {
      console.log('CREATE failed', err)
      toast({
        ...toastError,
        title: 'Failed to create book',
        description: String(err),
      })
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
            defaultValue={initialValue?.author}
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
            defaultValue={initialValue?.title}
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
            defaultValue={initialValue?.suggestedBy ?? ''}
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
