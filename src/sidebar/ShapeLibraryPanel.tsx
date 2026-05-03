import { useCallback, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useDraggable } from '@neodrag/react'
import { useReactFlow, type XYPosition } from '@xyflow/react'

import {
  addNodeFromShapeDrop,
  createShapeDragPreview,
  moveShapeDragPreview,
  type ShapeDragPreviewState,
} from '../commands/DragNDrop'
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
  const dragPreviewOriginRef = useRef<ShapeDragPreviewState | null>(null)
  const [dragPosition, setDragPosition] = useState<XYPosition>({ x: 0, y: 0 })
  const [dragPreview, setDragPreview] = useState<ShapeDragPreviewState | null>(null)

  const { isDragging } = useDraggable(draggableRef, {
    position: dragPosition,
    transform: () => 'none',
    onDragStart: ({ rootNode, offsetX, offsetY }) => {
      const preview = createShapeDragPreview(item, rootNode)
      dragPreviewOriginRef.current = preview
      setDragPosition({ x: offsetX, y: offsetY })
      setDragPreview(moveShapeDragPreview(preview, offsetX, offsetY))
    },
    onDrag: ({ offsetX, offsetY }) => {
      const preview = dragPreviewOriginRef.current

      setDragPosition({ x: offsetX, y: offsetY })

      if (preview) {
        setDragPreview(moveShapeDragPreview(preview, offsetX, offsetY))
      }
    },
    onDragEnd: ({ event }) => {
      dragPreviewOriginRef.current = null
      setDragPreview(null)
      setDragPosition({ x: 0, y: 0 })
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
      {dragPreview && createPortal(
        <div
          className="shape-library-drag-preview"
          style={{
            left: dragPreview.left,
            top: dragPreview.top,
            width: dragPreview.width,
            height: dragPreview.height,
          }}
        >
          {dragPreview.label}
        </div>,
        document.body,
      )}
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
