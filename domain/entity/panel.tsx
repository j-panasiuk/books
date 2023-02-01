import { Drawer, DrawerContent, DrawerOverlay } from '@chakra-ui/react'
import type { ComponentType } from 'react'
import type { Panel } from 'utils/interaction/panel'
import type { Entity } from '.'

export interface EntityPanelProps<T extends Entity> extends Panel<T> {
  CreatePanel: ComponentType<{
    value: undefined
    create: () => void // TODO
  }>
  UpdatePanel: ComponentType<{
    value: T
    update: () => void // TODO
    remove: () => void // TODO
  }>
}

export function EntityPanel<T extends Entity>({
  CreatePanel,
  UpdatePanel,
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
            <CreatePanel
              {...panelControls}
              value={opened.value}
              create={() => console.log('TODO create book')}
            />
          ) : (
            <UpdatePanel
              {...panelControls}
              value={opened.value}
              update={() => console.log('TODO update book')}
              remove={() => console.log('TODO remove book')}
            />
          )
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
