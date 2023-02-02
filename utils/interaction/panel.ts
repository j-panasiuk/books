import { useState } from 'react'

export interface PanelControls<T> {
  openCreatePanel: () => void
  openUpdatePanel: (value: T) => void
  closePanel: () => void
}

export interface Panel<T> extends PanelControls<T> {
  opened?: OpenedState<T>
}

type OpenedState<T> =
  | { type: 'create'; value: undefined }
  | { type: 'update'; value: T }

export function usePanel<T>(): Panel<T> {
  const [opened, setOpened] = useState<OpenedState<T>>()

  const openCreatePanel = () => setOpened({ type: 'create', value: undefined })
  const openUpdatePanel = (value: T) => setOpened({ type: 'update', value })
  const closePanel = () => setOpened(undefined)

  return {
    opened,
    openCreatePanel,
    openUpdatePanel,
    closePanel,
  }
}
