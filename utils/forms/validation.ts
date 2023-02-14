export function focusFirstError(formId: string) {
  window.requestIdleCallback(() => {
    const formEl = document.getElementById(formId)
    const invalidEl = formEl?.querySelector<HTMLElement>('[aria-invalid]')
    if (invalidEl) {
      invalidEl.focus()
    }
  })
}
