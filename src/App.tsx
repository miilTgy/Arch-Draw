import { useCallback, type DragEvent } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  addEdge,
  useReactFlow,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'

import { ModuleNode } from './ModuleNode'
import { Sidebar, type SidebarNodePayload } from './Sidebar'

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

const isSidebarNodePayload = (value: unknown): value is SidebarNodePayload => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const payload = value as Partial<SidebarNodePayload>

  return (
    payload.nodeType === 'module' &&
    typeof payload.shapeKind === 'string' &&
    typeof payload.defaultLabel === 'string'
  )
}

const getId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `node_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

function FlowCanvas() {
  const { screenToFlowPosition } = useReactFlow()
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

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()

      const rawPayload = event.dataTransfer.getData('application/reactflow')

      if (!rawPayload) {
        return
      }

      let payload: unknown

      try {
        payload = JSON.parse(rawPayload)
      } catch {
        return
      }

      if (!isSidebarNodePayload(payload)) {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: Node = {
        id: getId(),
        type: payload.nodeType,
        position,
        data: {
          label: payload.defaultLabel,
          shapeKind: payload.shapeKind,
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition, setNodes],
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
          onDragOver={onDragOver}
          onDrop={onDrop}
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
