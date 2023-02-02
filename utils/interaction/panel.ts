import { useState } from 'react'

export interface PanelControls<T> {
  openCreatePanel: (initialValue?: Partial<T>) => void
  openUpdatePanel: (initialValue: T) => void
  closePanel: () => void
}

export interface Panel<T> extends PanelControls<T> {
  opened?: OpenedState<T>
}

type OpenedState<T> =
  | { type: 'create'; initialValue: Partial<T> | undefined }
  | { type: 'update'; initialValue: T }

export function usePanel<T>(): Panel<T> {
  const [opened, setOpened] = useState<OpenedState<T>>()

  const openCreatePanel = (initialValue?: Partial<T>) => {
    setOpened({ type: 'create', initialValue })
  }
  const openUpdatePanel = (initialValue: T) => {
    setOpened({ type: 'update', initialValue })
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
