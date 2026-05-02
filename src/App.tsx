import { useCallback } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
} from '@xyflow/react'

import { ModuleNode, type ModuleNodeType } from './ModuleNode'
import { Sidebar } from './Sidebar'

import '@xyflow/react/dist/style.css'
import './App.css'

const nodeTypes = {
  module: ModuleNode,
}

const defaultModuleNodeSize = {
  width: 180,
  height: 70,
}

const initialNodes: ModuleNodeType[] = [
  {
    id: 'A',
    type: 'module',
    position: { x: 100, y: 120 },
    data: { label: 'Module A', ...defaultModuleNodeSize },
  },
  {
    id: 'B',
    type: 'module',
    position: { x: 420, y: 120 },
    data: { label: 'Module B', ...defaultModuleNodeSize },
  },
]

const initialEdges: Edge[] = []

function FlowCanvas() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
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
      <Sidebar />
      <div className="flow-wrapper">
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
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  )
}
