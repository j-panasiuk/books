import * as s from 'superstruct'
import { useState } from 'react'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Input,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react'
import type { PanelCreateProps } from 'domain/entity/panel'
import { PanelContent } from 'components/PanelContent'
import { Form } from 'components/Form'
import { createResponseFormValidator } from 'utils/api/response'
import {
  getErrorToastDescription,
  toastSuccess,
  toastError,
} from 'utils/feedback/toast'
import {
  type Book,
  getShorthand,
  BookCreateInput,
  bookCreateInputStruct,
} from 'domain/entity/Book'
import {
  BookVolumeCard,
  BookVolumeCardAdd,
} from 'domain/entity/BookVolume/Cards'
import { bookVolumeStruct, canRemoveVolume } from 'domain/entity/BookVolume'
import { fetchBook } from './index.api'

// --- FORM VALUES ---

type BookCreateFormValues = s.Infer<typeof formStruct>
const formStruct = bookCreateInputStruct satisfies s.Describe<BookCreateInput>

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

export function BookPanelCreate({
  initialValue,
  closePanel,
  openCreatePanel,
  openUpdatePanel,
  create,
}: PanelCreateProps<Book>) {
  const toast = useToast()
  const [formValues, setFormValues] = useState<BookCreateFormValues>(
    formStruct.create(initialValue)
  )
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const onSave = async (): Promise<Book> => {
    try {
      const created = await create(formValues)
      toast({
        ...toastSuccess,
        title: 'Created book',
        description: getShorthand(created),
      })
      return created
    } catch (err) {
      let errors = getFormErrors(err)
      if (errors) {
        setFormErrors(errors)
      } else {
        toast({
          ...toastError,
          title: 'Failed to create book',
          description: getErrorToastDescription(err),
        })
      }
      return Promise.reject(err)
    }
  }

  const saveAndAddAnother = () => onSave().then(openCreatePanel)
  const saveAndEdit = () =>
    onSave().then(async ({ id }) => {
      openUpdatePanel(await fetchBook(id))
    })
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
          <Button type="submit" form={Form.id}>
            Save
          </Button>
        </ButtonGroup>
      }
    >
      <SimpleGrid columns={3} gridGap={2}>
        <Form
          onSubmit={(ev) => {
            ev.preventDefault()
            saveAndClose()
          }}
        >
          <FormControl isInvalid={Boolean(formErrors.author)}>
            <FormLabel htmlFor="author">Author</FormLabel>
            <Input
              id="author"
              type="text"
              value={formValues.author}
              onChange={(ev) => {
                setFormValues((values): BookCreateFormValues => {
                  return { ...values, author: ev.target.value }
                })
                if (formErrors.author) {
                  setFormErrors(({ author, ...rest }) => rest)
                }
              }}
            />
            {formErrors.author ? (
              <FormErrorMessage>{formErrors.author}</FormErrorMessage>
            ) : null}
          </FormControl>

          <FormControl isRequired isInvalid={Boolean(formErrors.title)}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              id="title"
              type="text"
              value={formValues.title}
              onChange={(ev) => {
                setFormValues((values): BookCreateFormValues => {
                  return { ...values, title: ev.target.value }
                })
                if (formErrors.title) {
                  setFormErrors(({ title, ...rest }) => rest)
                }
              }}
            />
            {formErrors.title ? (
              <FormErrorMessage>{formErrors.title}</FormErrorMessage>
            ) : null}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="suggested_by">Suggested by</FormLabel>
            <Input
              id="suggested_by"
              type="text"
              value={formValues.suggestedBy}
              onChange={(ev) => {
                setFormValues((values): BookCreateFormValues => {
                  return { ...values, suggestedBy: ev.target.value }
                })
                if (formErrors.suggestedBy) {
                  setFormErrors(({ suggestedBy, ...rest }) => rest)
                }
              }}
            />
          </FormControl>

          <GridItem colStart={1} colEnd={-1} mt={2} mb={-2}>
            <FormLabel>Volumes</FormLabel>
          </GridItem>

          {formValues.volumes.map((vol) => (
            <BookVolumeCard
              key={vol.no}
              volume={vol}
              updateVolume={(v) => {
                setFormValues((values): BookCreateFormValues => {
                  return {
                    ...values,
                    volumes: values.volumes.map((_v) =>
                      _v.no === v.no ? { ..._v, ...v } : _v
                    ),
                  }
                })
              }}
              removeVolume={
                canRemoveVolume(vol, formValues.volumes)
                  ? () => {
                      setFormValues((values): BookCreateFormValues => {
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
            />
          ))}

          <BookVolumeCardAdd
            onClick={() => {
              setFormValues((values): BookCreateFormValues => {
                const nextNo = values.volumes.length + 1
                const nextVolume = bookVolumeStruct.create(nextNo)
                return {
                  ...values,
                  volumes: values.volumes.concat(nextVolume),
                }
              })
            }}
          />
        </Form>
      </SimpleGrid>
    </PanelContent>
  )
}
