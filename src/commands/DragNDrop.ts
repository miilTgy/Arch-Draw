import { type Node, type XYPosition } from '@xyflow/react'

import { type ModuleNodeData } from '../nodes/ModuleNode'
import { type ShapeSpec } from '../shapelibs/builtinlib'

type ModuleFlowNode = Node<ModuleNodeData, 'module'>

type AddNodeFromShapeDropOptions = {
  shape: ShapeSpec
  screenPosition: XYPosition
  screenToFlowPosition: (clientPosition: XYPosition) => XYPosition
  setNodes: (payload: ModuleFlowNode[] | ((nodes: ModuleFlowNode[]) => ModuleFlowNode[])) => void
}

const getId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `node_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export function addNodeFromShapeDrop({
  shape,
  screenPosition,
  screenToFlowPosition,
  setNodes,
}: AddNodeFromShapeDropOptions) {
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
  const newNode: ModuleFlowNode = {
    id: getId(),
    type: shape.nodeType,
    position: {
      x: dropPosition.x - shape.width / 2,
      y: dropPosition.y - shape.height / 2,
    },
    data: {
      label: shape.defaultLabel,
      shapeId: shape.shapeId,
      width: shape.width,
      height: shape.height,
      logicType: shape.logicType,
    },
  }

  setNodes((nodes) => nodes.concat(newNode))
}
