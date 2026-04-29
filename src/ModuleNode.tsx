import { Handle, Position } from '@xyflow/react'

export function ModuleNode({ data }: any) {
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