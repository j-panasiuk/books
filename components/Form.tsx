import { type HTMLProps, type FormEventHandler, useCallback } from 'react'

interface FormProps extends Omit<HTMLProps<HTMLFormElement>, 'onSubmit'> {
  submit: () => unknown
  id: string
}

export function Form({ submit, id, ...props }: FormProps) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (ev) => {
      ev.preventDefault()
      submit()
    },
    [submit]
  )

  return <form id={id} onSubmit={handleSubmit} style={style} {...props} />
}

const style = { display: 'contents' }
