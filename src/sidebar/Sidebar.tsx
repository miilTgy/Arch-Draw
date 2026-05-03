import { useCallback, useRef, useState, type ReactNode } from 'react'
import { useDraggable } from '@neodrag/react'
import { useReactFlow, type XYPosition } from '@xyflow/react'

import { addNodeFromShapeDrop } from '../commands/DragNDrop'
import { type ModuleNodeType } from '../nodes/ModuleNode'
import { builtinShapeLibrary, type ShapeSpec } from '../shapelibs/builtinlib'

type DraggableSidebarItemProps = {
  children: ReactNode
  item: ShapeSpec
  onDrop: (item: ShapeSpec, screenPosition: XYPosition) => void
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
  const { screenToFlowPosition, setNodes } = useReactFlow<ModuleNodeType>()

  const handleNodeDrop = useCallback(
    (item: ShapeSpec, screenPosition: XYPosition) => {
      addNodeFromShapeDrop({
        shape: item,
        screenPosition,
        screenToFlowPosition,
        setNodes,
      })
    },
    [screenToFlowPosition, setNodes],
  )

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Shapes</div>
      <div className="sidebar-items">
        {builtinShapeLibrary.map((item) => (
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
