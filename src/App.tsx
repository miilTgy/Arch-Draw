import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'

import { ModuleNode } from "./ModuleNode";

import '@xyflow/react/dist/style.css'
import './App.css'

const nodeTypes = {
  module: ModuleNode,
}

const initialNodes: Node[] = [
  {
    id: 'A',
    type: 'module',
    position: { x: 100, y: 120 },
    data: { label: 'Module A' },
  },
  {
    id: 'B',
    type: 'module',
    position: { x: 420, y: 120 },
    data: { label: 'Module B' },
  },
]

const initialEdges: Edge[] = []

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({
        ...connection,
        type: 'smoothstep',
      }, eds))
    },
    [setEdges],
  )

  return (
    <div className="app">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}