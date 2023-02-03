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
import {
  getErrorToastDescription,
  toastError,
  toastSuccess,
} from 'utils/feedback/toast'
import { getShorthand } from 'domain/entity/book/Book'

export function BookPanelUpdate({
  initialValue,
  closePanel,
  openCreatePanel,
  update,
  remove,
}: PanelUpdateProps<Serialized<Book>>) {
  const toast = useToast()
  const [bookInput, setBookInput] = useState<Prisma.BookUpdateInput>({
    author: initialValue.author,
    title: initialValue.title,
    suggestedBy: initialValue.suggestedBy,
  })

  const onSave = async (): Promise<Serialized<Book>> => {
    try {
      const { author, title, suggestedBy } = bookInput
      const updated = await update(initialValue.id, {
        author,
        title,
        suggestedBy,
      })
      toast({
        ...toastSuccess,
        title: 'Updated book',
        description: getShorthand(updated),
      })
      return updated
    } catch (err) {
      toast({
        ...toastError,
        title: 'Failed to update book',
        description: getErrorToastDescription(err),
      })
      return Promise.reject(err)
    }
  }

  const onRemove = async (): Promise<unknown> => {
    try {
      const deleted = await remove(initialValue.id).then(closePanel)
      toast({
        ...toastSuccess,
        title: 'Deleted book',
        description: getShorthand(initialValue),
      })
      return deleted
    } catch (err) {
      toast({
        ...toastError,
        title: 'Failed to delete book',
        description: getErrorToastDescription(err),
      })
      return Promise.reject(err)
    }
  }

  const saveAndClose = () => onSave().then(closePanel)
  const copyAsNewDraft = () => openCreatePanel(initialValue)

  return (
    <PanelContent
      close={closePanel}
      header={
        <Flex alignItems="center" justifyContent="space-between">
          <>{initialValue.title}</>
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
            defaultValue={initialValue.author}
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
            defaultValue={initialValue.title}
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
            defaultValue={initialValue.suggestedBy ?? ''}
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
