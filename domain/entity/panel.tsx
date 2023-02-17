import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  type DrawerProps,
  useBreakpoint,
} from '@chakra-ui/react'
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

export interface PanelCreateProps<T extends Entity> extends PanelControls<T> {
  initialValue: Partial<T> | undefined
  create: Api.Create<T>
}

export interface PanelUpdateProps<T extends Entity> extends PanelControls<T> {
  initialValue: T
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
  const breakpoint = useBreakpoint()

  const drawerProps: Pick<DrawerProps, 'placement' | 'size'> =
    breakpoint === '2xl'
      ? { placement: 'right', size: 'xl' }
      : { placement: 'top', size: undefined }

  const { opened, ...panelControls } = panel

  return (
    <Drawer
      {...drawerProps}
      isOpen={Boolean(opened)}
      onClose={panelControls.closePanel}
    >
      <DrawerOverlay />
      <DrawerContent>
        {opened ? (
          opened.type === 'create' ? (
            <PanelCreate
              {...panelControls}
              initialValue={opened.initialValue}
              create={create}
            />
          ) : (
            <PanelUpdate
              {...panelControls}
              initialValue={opened.initialValue}
              update={update}
              remove={remove}
            />
          )
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
