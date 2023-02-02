import { Drawer, DrawerContent, DrawerOverlay } from '@chakra-ui/react'
import type { ComponentType } from 'react'
import type { Panel, PanelControls } from 'utils/interaction/panel'
import type * as Api from './api'
import type { Entity } from '.'

export interface EntityPanelProps<T extends Entity> extends Panel<T> {
  PanelCreate: ComponentType<PanelCreateProps<T>>
  PanelUpdate: ComponentType<PanelUpdateProps<T>>
  create: Api.Create<T>
  update: Api.Update<T>
  remove: Api.Remove
}

interface PanelCreateProps<T extends Entity> extends PanelControls<T> {
  value: undefined
  create: Api.Create<T>
}

interface PanelUpdateProps<T extends Entity> extends PanelControls<T> {
  value: T
  update: Api.Update<T>
  remove: Api.Remove
}

export function EntityPanel<T extends Entity>({
  PanelCreate,
  PanelUpdate,
  create,
  update,
  remove,
  ...panel
}: EntityPanelProps<T>) {
  const { opened, ...panelControls } = panel

  return (
    <Drawer
      placement="top"
      isOpen={Boolean(opened)}
      onClose={panelControls.closePanel}
    >
      <DrawerOverlay />
      <DrawerContent>
        {opened ? (
          opened.type === 'create' ? (
            <PanelCreate
              {...panelControls}
              value={opened.value}
              create={create}
            />
          ) : (
            <PanelUpdate
              {...panelControls}
              value={opened.value}
              update={update}
              remove={remove}
            />
          )
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
