import type { DragEvent } from 'react'

export type SidebarShapeKind = 'module' | 'register' | 'mux' | 'alu' | 'memory'

export type SidebarNodePayload = {
  nodeType: 'module'
  shapeKind: SidebarShapeKind
  defaultLabel: string
}

const sidebarItems: SidebarNodePayload[] = [
  { nodeType: 'module', shapeKind: 'module', defaultLabel: 'Module' },
  { nodeType: 'module', shapeKind: 'register', defaultLabel: 'Register' },
  { nodeType: 'module', shapeKind: 'mux', defaultLabel: 'Mux' },
  { nodeType: 'module', shapeKind: 'alu', defaultLabel: 'ALU' },
  { nodeType: 'module', shapeKind: 'memory', defaultLabel: 'Memory' },
]

const onDragStart = (event: DragEvent<HTMLDivElement>, payload: SidebarNodePayload) => {
  event.dataTransfer.setData('application/reactflow', JSON.stringify(payload))
  event.dataTransfer.effectAllowed = 'move'
}

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Shapes</div>
      <div className="sidebar-items">
        {sidebarItems.map((item) => (
          <div
            key={item.shapeKind}
            className="sidebar-item"
            draggable
            onDragStart={(event) => onDragStart(event, item)}
          >
            {item.defaultLabel}
          </div>
        ))}
      </div>
    </aside>
  )
}
