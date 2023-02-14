import { Code, CodeProps, GridItem } from '@chakra-ui/react'
import { type Id } from 'domain/attribute/id'
import { isSameCaseInsensitive } from 'domain/attribute/name'
import {
  useBooks,
  useBooksAuthorPeople,
  useBooksSuggestedByPeople,
} from './queries'
import { getShorthand, matchByAuthor } from '.'

type Props = {
  author: string
  title: string
  suggestedBy: string
  bookId?: Id
}

export function BookHints({ author, title, suggestedBy, bookId }: Props) {
  return (
    <>
      <BookAuthorHints author={author} />
      <BookTitleHints title={title} bookId={bookId} />
      <BookSuggestedByHints suggestedBy={suggestedBy} />
    </>
  )
}

function BookAuthorHints({ author }: Pick<Props, 'author'>) {
  const books = useBooks()
  const existingAuthors = useBooksAuthorPeople()

  const matchingAuthor = existingAuthors.find((exs) =>
    isSameCaseInsensitive(author, exs)
  )

  return (
    <GridItem>
      {matchingAuthor && (
        <>
          <Code {...codeProps} background="green.100">
            {matchingAuthor}
          </Code>
          <Code {...codeProps}>
            {books
              .filter(matchByAuthor(matchingAuthor))
              .map(getShorthand)
              .join('\n')}
          </Code>
        </>
      )}
    </GridItem>
  )
}

function BookTitleHints({ title, bookId }: Pick<Props, 'title' | 'bookId'>) {
  const existingBooks = useBooks()

  const matchingTitleBooks = existingBooks.filter((exs) =>
    isSameCaseInsensitive(title, exs.title)
  )

  const anotherBookWithSameTitleExists =
    bookId === undefined
      ? matchingTitleBooks.length > 0
      : matchingTitleBooks.length > 1

  return (
    <GridItem>
      {matchingTitleBooks.length > 0 && (
        <Code
          {...codeProps}
          background={
            anotherBookWithSameTitleExists ? 'yellow.100' : 'gray.100'
          }
        >
          {matchingTitleBooks.map(getShorthand).join('\n')}
        </Code>
      )}
    </GridItem>
  )
}

function BookSuggestedByHints({ suggestedBy }: Pick<Props, 'suggestedBy'>) {
  const existingSuggesters = useBooksSuggestedByPeople()

  const suggestedByPeople = suggestedBy.split(', ')
  const matchingSuggestPeople = existingSuggesters.filter((exs) =>
    suggestedByPeople.some((person) => isSameCaseInsensitive(person, exs))
  )

  return (
    <GridItem>
      {matchingSuggestPeople.length > 0 && (
        <Code {...codeProps} background="green.100">
          {matchingSuggestPeople.join('\n')}
        </Code>
      )}
    </GridItem>
  )
}

const codeProps: CodeProps = {
  width: '100%',
  padding: 1,
  whiteSpace: 'pre',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
}
