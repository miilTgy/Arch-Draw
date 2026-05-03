import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'

export type ModuleNodeData = {
  width: number
  height: number
  label?: string
  shapeId?: string
}

export type ModuleNodeType = Node<ModuleNodeData, 'module'>

export function ModuleNode({ data }: NodeProps<ModuleNodeType>) {
  return (
    <div className="module-node" style={{ width: data.width, height: data.height }}>
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
