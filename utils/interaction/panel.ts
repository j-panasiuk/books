import { useState } from 'react'

export interface PanelControls<T> {
  openCreatePanel: (value?: Partial<T>) => void
  openUpdatePanel: (value: T) => void
  closePanel: () => void
}

export interface Panel<T> extends PanelControls<T> {
  opened?: OpenedState<T>
}

type OpenedState<T> =
  | { type: 'create'; value: Partial<T> | undefined }
  | { type: 'update'; value: T }

export function usePanel<T>(): Panel<T> {
  const [opened, setOpened] = useState<OpenedState<T>>()

  const openCreatePanel = (value?: Partial<T>) => {
    setOpened({ type: 'create', value })
  }
  const openUpdatePanel = (value: T) => {
    setOpened({ type: 'update', value })
  }
  const closePanel = () => {
    setOpened(undefined)
  }

  return {
    opened,
    openCreatePanel,
    openUpdatePanel,
    closePanel,
  }
}
