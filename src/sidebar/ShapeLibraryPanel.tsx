import { useCallback, useRef, useState, type ReactNode } from 'react'
import { useDraggable } from '@neodrag/react'
import { useReactFlow, type XYPosition } from '@xyflow/react'

import { addNodeFromShapeDrop } from '../commands/DragNDrop'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'
import { type ModuleNodeType } from '../nodes/ModuleNode'
import { builtinShapeLibrary, type ShapeSpec } from '../shapelibs/builtinlib'

type DraggableShapeItemProps = {
  children: ReactNode
  item: ShapeSpec
  onDrop: (item: ShapeSpec, screenPosition: XYPosition) => void
}

function DraggableShapeItem({ children, item, onDrop }: DraggableShapeItemProps) {
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
      className={`shape-library-item${isDragging ? ' shape-library-item-dragging' : ''}`}
    >
      {children}
    </div>
  )
}

export function ShapeLibraryPanel() {
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
    <SidebarGroup className="shape-library-panel">
      <SidebarGroupLabel className="shape-library-title">Shapes</SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="shape-library-items">
          {builtinShapeLibrary.map((item) => (
            <DraggableShapeItem
              key={item.shapeId}
              item={item}
              onDrop={handleNodeDrop}
            >
              {item.defaultLabel}
            </DraggableShapeItem>
          ))}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
