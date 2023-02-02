import { useState } from 'react'
import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react'
import type { Book, Prisma } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import type { PanelUpdateProps } from 'domain/entity/panel'
import { PanelContent } from 'components/PanelContent'
import { toastError, toastSuccess } from 'utils/feedback/toast'
import { getShorthand } from 'domain/entity/book/Book'

export function BookPanelUpdate({
  value,
  closePanel,
  openCreatePanel,
  update,
  remove,
}: PanelUpdateProps<Serialized<Book>>) {
  const toast = useToast()
  const [bookInput, setBookInput] = useState<Prisma.BookUpdateInput>({
    author: value.author,
    title: value.title,
    suggestedBy: value.suggestedBy,
  })

  const onSave = async (): Promise<Serialized<Book>> => {
    try {
      const { author, title, suggestedBy } = bookInput
      const updated = await update(value.id, { author, title, suggestedBy })
      toast({
        ...toastSuccess,
        title: 'Updated book',
        description: getShorthand(updated),
      })
      return updated
    } catch (err) {
      console.log('UPDATE failed', err)
      toast({
        ...toastError,
        title: 'Failed to update book',
        description: String(err),
      })
      return Promise.reject(err)
    }
  }

  const onRemove = async (): Promise<unknown> => {
    try {
      const deleted = await remove(value.id).then(closePanel)
      toast({
        ...toastSuccess,
        title: 'Deleted book',
        description: getShorthand(value),
      })
      return deleted
    } catch (err) {
      console.log('DELETE failed', err)
      toast({
        ...toastError,
        title: 'Failed to delete book',
        description: String(err),
      })
      return Promise.reject(err)
    }
  }

  const saveAndClose = () => onSave().then(closePanel)
  const copyAsNewDraft = () => openCreatePanel(value)

  return (
    <PanelContent
      close={closePanel}
      header={
        <Flex alignItems="center" justifyContent="space-between">
          <>{value.title}</>
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            onClick={onRemove}
          >
            Delete
          </Button>
        </Flex>
      }
      actions={
        <ButtonGroup size="sm" colorScheme="blue">
          <Button onClick={copyAsNewDraft} variant="outline">
            Copy as new draft
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
            defaultValue={value.author}
            onChange={(ev) => {
              setBookInput((input): Prisma.BookUpdateInput => {
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
            defaultValue={value.title}
            onChange={(ev) => {
              setBookInput((input): Prisma.BookUpdateInput => {
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
            defaultValue={value.suggestedBy ?? ''}
            onChange={(ev) => {
              setBookInput((input): Prisma.BookUpdateInput => {
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
