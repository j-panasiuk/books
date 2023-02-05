import type { Book } from 'domain/entity/Book'
import type { Api } from 'domain/entity/api'
import type { PanelControls } from 'utils/interaction/panel'
import { EntityPanel } from 'domain/entity/panel'
import { BookPanelCreate } from './panel.create'
import { BookPanelUpdate } from './panel.update'

interface BookPanelProps extends PanelControls<Book>, Api<Book> {}

export function BookPanel(props: BookPanelProps) {
  return (
    <EntityPanel
      {...props}
      PanelCreate={BookPanelCreate}
      PanelUpdate={BookPanelUpdate}
    />
  )
}
