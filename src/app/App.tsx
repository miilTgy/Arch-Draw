import { useCallback, type CSSProperties } from 'react'
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

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'

import { ModuleNode, type ModuleNodeType } from '../nodes/ModuleNode'
import { GeneralSidebar } from '../sidebar/GeneralSidebar'
import { ShapeLibraryPanel } from '../sidebar/ShapeLibraryPanel'

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
    data: { label: 'Module A', shapeId: 'module', ...defaultModuleNodeSize },
  },
  {
    id: 'B',
    type: 'module',
    position: { x: 420, y: 120 },
    data: { label: 'Module B', shapeId: 'module', ...defaultModuleNodeSize },
  },
]

const initialEdges: Edge[] = []

function CanvasSidebarTrigger() {
  const { isMobile, openMobile, state } = useSidebar()
  const isSidebarOpen = isMobile ? openMobile : state === 'expanded'

  return (
    <SidebarTrigger
      className={`sidebar-trigger ${isSidebarOpen ? 'sidebar-trigger-open' : 'sidebar-trigger-closed'}`}
    />
  )
}

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
    <SidebarProvider
      style={
        {
          '--sidebar-width': '200px',
          '--sidebar-width-mobile': '200px',
        } as CSSProperties
      }
    >
      <div className="app">
        <GeneralSidebar>
          <ShapeLibraryPanel />
        </GeneralSidebar>
        <SidebarInset className="flow-wrapper">
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
          <CanvasSidebarTrigger />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  )
}
