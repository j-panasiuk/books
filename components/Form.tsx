import type { HTMLProps } from 'react'

const _id = 'Form'

// For now let's assume there is only one `Form` component on the page at a time.
// If there are 2+, there will be collision of form ids!
// TODO: generate unique form ids
export function Form(props: HTMLProps<HTMLFormElement>) {
  return <form id={_id} style={{ display: 'contents' }} {...props} />
}

Form.id = _id
