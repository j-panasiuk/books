import type { Book } from '@prisma/client'
import type { Serialized } from 'domain/entity'
import { EntityPanel, type EntityPanelProps } from 'domain/entity/panel'
import { BookCreatePanel } from './panel.create'
import { BookUpdatePanel } from './panel.update'

type BookPanelProps = Omit<
  EntityPanelProps<Serialized<Book>>,
  'CreatePanel' | 'UpdatePanel'
>

export function BookPanel(props: BookPanelProps) {
  return (
    <EntityPanel
      {...props}
      CreatePanel={BookCreatePanel}
      UpdatePanel={BookUpdatePanel}
    />
  )
}
