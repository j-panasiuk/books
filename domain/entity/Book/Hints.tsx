import { Code, CodeProps, GridItem } from '@chakra-ui/react'
import { type Id } from 'domain/attribute/id'
import { isSameCaseInsensitive, splitNames } from 'domain/attribute/name'
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

export function BookAuthorHints({ author }: Pick<Props, 'author'>) {
  const books = useBooks()
  const existingAuthors = useBooksAuthorPeople()

  const coauthors = splitNames(author)
  const matchingAuthors =
    author.length > 0
      ? existingAuthors.filter((exs) =>
          coauthors.some(
            (coauthor) =>
              coauthor.length > 0 && isSameCaseInsensitive(coauthor, exs)
          )
        )
      : []

  return (
    <GridItem mt={2}>
      {matchingAuthors.length > 0 && (
        <>
          <Code {...codeProps} background="green.100">
            {matchingAuthors.join('\n')}
          </Code>
          {matchingAuthors.map((matchingAuthor) => (
            <Code key={matchingAuthor} {...codeProps}>
              {books
                .filter(matchByAuthor(matchingAuthor))
                .map(getShorthand)
                .join('\n')}
            </Code>
          ))}
        </>
      )}
    </GridItem>
  )
}

export function BookTitleHints({
  title,
  bookId,
}: Pick<Props, 'title' | 'bookId'>) {
  const existingBooks = useBooks()

  const matchingTitleBooks = existingBooks.filter((exs) =>
    isSameCaseInsensitive(title, exs.title)
  )

  const anotherBookWithSameTitleExists =
    bookId === undefined
      ? matchingTitleBooks.length > 0
      : matchingTitleBooks.length > 1

  return (
    <GridItem mt={2}>
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

export function BookSuggestedByHints({
  suggestedBy,
}: Pick<Props, 'suggestedBy'>) {
  const existingSuggesters = useBooksSuggestedByPeople()

  const suggestedByPeople = splitNames(suggestedBy)
  const matchingSuggestPeople = existingSuggesters.filter((exs) =>
    suggestedByPeople.some((person) => isSameCaseInsensitive(person, exs))
  )

  return (
    <GridItem mt={2}>
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
