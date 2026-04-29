import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'

type ModuleNodeData = {
  label?: string
  shapeKind?: string
}

type ModuleNodeType = Node<ModuleNodeData, 'module'>

export function ModuleNode({ data }: NodeProps<ModuleNodeType>) {
  return (
    <div className="module-node">
      <Handle
        id="in"
        type="target"
        position={Position.Left}
        className="port-handle"
      />

      <div className="module-title">{data.label}</div>

      <Handle
        id="out"
        type="source"
        position={Position.Right}
        className="port-handle"
      />
    </div>
  )
}
