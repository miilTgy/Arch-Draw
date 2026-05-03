import { useCallback, useRef, useState, type ReactNode } from 'react'
import { useDraggable } from '@neodrag/react'
import { useReactFlow, type Node, type XYPosition } from '@xyflow/react'

import { type ModuleNodeData } from '../nodes/ModuleNode'

export type SidebarshapeId = 'module' | 'register' | 'mux' | 'alu' | 'memory'

type SidebarNodePayload = {
  nodeType: 'module'
  shapeId: SidebarshapeId
  defaultLabel: string
  width: number
  height: number
}

const defaultModuleNodeSize = {
  width: 180,
  height: 70,
}

const sidebarItems: SidebarNodePayload[] = [
  { nodeType: 'module', shapeId: 'module', defaultLabel: 'Module', ...defaultModuleNodeSize },
  { nodeType: 'module', shapeId: 'register', defaultLabel: 'Register', ...defaultModuleNodeSize },
  { nodeType: 'module', shapeId: 'mux', defaultLabel: 'Mux', ...defaultModuleNodeSize },
  { nodeType: 'module', shapeId: 'alu', defaultLabel: 'ALU', ...defaultModuleNodeSize },
  { nodeType: 'module', shapeId: 'memory', defaultLabel: 'Memory', ...defaultModuleNodeSize },
]

const getId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `node_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

type DraggableSidebarItemProps = {
  children: ReactNode
  item: SidebarNodePayload
  onDrop: (item: SidebarNodePayload, screenPosition: XYPosition) => void
}

function DraggableSidebarItem({ children, item, onDrop }: DraggableSidebarItemProps) {
  const draggableRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<XYPosition>({ x: 0, y: 0 })

  const { isDragging } = useDraggable(draggableRef, {
    position,
    onDrag: ({ offsetX, offsetY }) => {
      setPosition({ x: offsetX, y: offsetY })
    },
    onDragEnd: ({ event }) => {
      setPosition({ x: 0, y: 0 })
      onDrop(item, {
        x: event.clientX,
        y: event.clientY,
      })
    },
  })

  return (
    <div
      ref={draggableRef}
      className={`sidebar-item${isDragging ? ' sidebar-item-dragging' : ''}`}
    >
      {children}
    </div>
  )
}

export function Sidebar() {
  const { screenToFlowPosition, setNodes } = useReactFlow()

  const handleNodeDrop = useCallback(
    (item: SidebarNodePayload, screenPosition: XYPosition) => {
      const flow = document.querySelector('.react-flow')
      const flowRect = flow?.getBoundingClientRect()
      const isInFlow =
        flowRect &&
        screenPosition.x >= flowRect.left &&
        screenPosition.x <= flowRect.right &&
        screenPosition.y >= flowRect.top &&
        screenPosition.y <= flowRect.bottom

      if (!isInFlow) {
        return
      }

      const dropPosition = screenToFlowPosition(screenPosition)
      const newNode: Node<ModuleNodeData, 'module'> = {
        id: getId(),
        type: item.nodeType,
        position: {
          x: dropPosition.x - item.width / 2,
          y: dropPosition.y - item.height / 2,
        },
        data: {
          label: item.defaultLabel,
          shapeId: item.shapeId,
          width: item.width,
          height: item.height,
        },
      }

      setNodes((nodes) => nodes.concat(newNode))
    },
    [screenToFlowPosition, setNodes],
  )

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Shapes</div>
      <div className="sidebar-items">
        {sidebarItems.map((item) => (
          <DraggableSidebarItem
            key={item.shapeId}
            item={item}
            onDrop={handleNodeDrop}
          >
            {item.defaultLabel}
          </DraggableSidebarItem>
        ))}
      </div>
    </aside>
  )
}
