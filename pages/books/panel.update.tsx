import { useState } from 'react'
import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
} from '@chakra-ui/react'
import type { Book, Prisma } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import type { PanelUpdateProps } from 'domain/entity/panel'
import { PanelContent } from 'components/PanelContent'

export function BookPanelUpdate({
  value,
  closePanel,
  openCreatePanel,
  update,
  remove,
}: PanelUpdateProps<Serialized<Book>>) {
  const [bookInput, setBookInput] = useState<Prisma.BookUpdateInput>({
    author: value.author,
    title: value.title,
    suggestedBy: value.suggestedBy,
  })

  const onSave = (): Promise<Serialized<Book>> => {
    try {
      const { author, title, suggestedBy } = bookInput
      return update(value.id, { author, title, suggestedBy })
    } catch (err) {
      console.log('UPDATE failed', err)
      return Promise.reject(err)
    }
  }

  const onRemove = (): Promise<unknown> => {
    try {
      return remove(value.id).then(closePanel)
    } catch (err) {
      console.log('DELETE failed', err)
      return Promise.reject(err)
    }
  }

  const saveAndClose = () => onSave().then(closePanel)
  const copyAsNewDraft = () => openCreatePanel() // TODO pass initial values

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
