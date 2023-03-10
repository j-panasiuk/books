import * as s from 'superstruct'
import { useId, useState } from 'react'
import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Input,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react'
import type { PanelUpdateProps } from 'domain/entity/panel'
import { PanelContent } from 'components/PanelContent'
import { JSONPreview } from 'components/JSONPreview'
import { Form } from 'components/Form'
import { createResponseFormValidator } from 'utils/api/response'
import { focusFirstError } from 'utils/forms/validation'
import {
  getErrorToastDescription,
  toastError,
  toastSuccess,
} from 'utils/feedback/toast'
import { T } from 'utils/translate'
import {
  type Book,
  type BookUpdateInput,
  getShorthand,
  bookUpdateInputStruct,
  bookUpdateInputValidStruct,
} from 'domain/entity/Book'
import {
  BookAuthorHints,
  BookTitleHints,
  BookSuggestedByHints,
} from 'domain/entity/Book/Hints'
import { bookVolumeStruct, canRemoveVolume } from 'domain/entity/BookVolume'
import {
  BookVolumeCard,
  BookVolumeCardAdd,
} from 'domain/entity/BookVolume/Cards'
import { useSellers } from 'domain/entity/Seller/queries'

// --- FORM VALUES ---

type BookUpdateFormValues = s.Infer<typeof bookUpdateInputStruct>
const formStruct = bookUpdateInputStruct satisfies s.Describe<BookUpdateInput>

// --- FORM ERRORS ---

type FormErrors = s.Infer<typeof formErrorsStruct>
const formErrorsStruct = s.partial(
  s.object({
    author: s.string(),
    title: s.string(),
    suggestedBy: s.string(),
    volumes: s.string(),
  })
)

const getFormErrors = createResponseFormValidator(formErrorsStruct)

// --- PANEL ---

export function BookPanelUpdate({
  initialValue,
  closePanel,
  openCreatePanel,
  update,
  remove,
}: PanelUpdateProps<Book>) {
  const toast = useToast()
  const formId = useId()
  const [formValues, setFormValues] = useState<BookUpdateFormValues>(
    formStruct.create(initialValue)
  )
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const sellers = useSellers()

  const onSave = async (): Promise<Book> => {
    try {
      const updated = await update(initialValue.id, formValues)
      toast({
        ...toastSuccess,
        title: T('Updated book'),
        description: getShorthand(updated),
      })
      return updated
    } catch (err) {
      const errors = getFormErrors(err)
      if (errors) {
        setFormErrors(errors)
        focusFirstError(formId)
      } else {
        toast({
          ...toastError,
          title: T('Failed to update book'),
          description: getErrorToastDescription(err),
        })
      }
      return Promise.reject(err)
    }
  }

  const onRemove = async (): Promise<unknown> => {
    try {
      const deleted = await remove(initialValue.id).then(closePanel)
      toast({
        ...toastSuccess,
        title: T('Deleted book'),
        description: getShorthand(initialValue),
      })
      return deleted
    } catch (err) {
      toast({
        ...toastError,
        title: T('Failed to delete book'),
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
            {T('Delete')}
          </Button>
        </Flex>
      }
      actions={
        <ButtonGroup size="sm" colorScheme="blue">
          <Button onClick={copyAsNewDraft} variant="outline">
            {T('Copy as new draft')}
          </Button>
          <Button type="submit" form={formId}>
            {T('Save')}
          </Button>
        </ButtonGroup>
      }
    >
      <SimpleGrid minChildWidth={360} gridGap={2}>
        <Form id={formId} submit={saveAndClose}>
          <FormControl isInvalid={Boolean(formErrors.author)}>
            <FormLabel htmlFor="author">{T('Author')}</FormLabel>
            <Input
              id="author"
              type="text"
              value={formValues.author}
              onChange={(ev) => {
                setFormValues((values): BookUpdateFormValues => {
                  return { ...values, author: ev.target.value }
                })
                if (formErrors.author) {
                  setFormErrors(({ author, ...rest }) => rest)
                }
              }}
              autoFocus
            />
            {formErrors.author ? (
              <FormErrorMessage>{formErrors.author}</FormErrorMessage>
            ) : null}
            <BookAuthorHints author={formValues.author} />
          </FormControl>

          <FormControl isRequired isInvalid={Boolean(formErrors.title)}>
            <FormLabel htmlFor="title">{T('Title')}</FormLabel>
            <Input
              id="title"
              type="text"
              value={formValues.title}
              onChange={(ev) => {
                setFormValues((values): BookUpdateFormValues => {
                  return { ...values, title: ev.target.value }
                })
                if (formErrors.title) {
                  setFormErrors(({ author, ...rest }) => rest)
                }
              }}
            />
            {formErrors.title ? (
              <FormErrorMessage>{formErrors.title}</FormErrorMessage>
            ) : null}
            <BookTitleHints title={formValues.title} bookId={initialValue.id} />
          </FormControl>

          <FormControl isInvalid={Boolean(formErrors.suggestedBy)}>
            <FormLabel htmlFor="suggested_by">{T('Suggested by')}</FormLabel>
            <Input
              id="suggested_by"
              type="text"
              value={formValues.suggestedBy}
              onChange={(ev) => {
                setFormValues((values): BookUpdateFormValues => {
                  return { ...values, suggestedBy: ev.target.value }
                })
                if (formErrors.suggestedBy) {
                  setFormErrors(({ author, ...rest }) => rest)
                }
              }}
            />
            {formErrors.suggestedBy ? (
              <FormErrorMessage>{formErrors.suggestedBy}</FormErrorMessage>
            ) : null}
            <BookSuggestedByHints suggestedBy={formValues.suggestedBy} />
          </FormControl>

          <GridItem colStart={1} colEnd={-1} mt={2} mb={-2}>
            <FormLabel>{T('Volumes')}</FormLabel>
          </GridItem>

          {formValues.volumes.map((vol) => (
            <BookVolumeCard
              key={vol.no}
              volume={vol}
              updateVolume={(v) => {
                setFormValues((values): BookUpdateFormValues => {
                  return {
                    ...values,
                    volumes: values.volumes.map((_v) =>
                      _v.no === v.no ? { ..._v, ...v } : _v
                    ),
                  }
                })
              }}
              removeVolume={
                canRemoveVolume(vol, formValues.volumes || [])
                  ? () => {
                      setFormValues((values): BookUpdateFormValues => {
                        return {
                          ...values,
                          volumes: values.volumes.filter(
                            (v) => v.no !== vol.no
                          ),
                        }
                      })
                    }
                  : undefined
              }
              sellers={sellers}
            />
          ))}

          <BookVolumeCardAdd
            onClick={() => {
              setFormValues((values): BookUpdateFormValues => {
                const volumes = values.volumes || []
                const nextNo = volumes.length + 1
                const nextVolume = bookVolumeStruct.create(nextNo)
                return {
                  ...values,
                  volumes: volumes.concat(nextVolume),
                }
              })
            }}
          />
        </Form>

        <GridItem colStart={1} colEnd={-1} mt={2}>
          <JSONPreview
            validStruct={bookUpdateInputValidStruct}
            formValues={formValues}
          />
        </GridItem>
      </SimpleGrid>
    </PanelContent>
  )
}
