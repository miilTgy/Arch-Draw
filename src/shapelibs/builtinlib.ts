export type ShapeSpec = {
  shapeId: string
  nodeType: 'module'
  defaultLabel: string
  width: number
  height: number
  logicType?: 'combinational' | 'sequential'
}

const defaultModuleNodeSize = {
  width: 180,
  height: 70,
}

export const builtinShapeLibrary: ShapeSpec[] = [
  { nodeType: 'module', shapeId: 'module', defaultLabel: 'Module', ...defaultModuleNodeSize },
  { nodeType: 'module', shapeId: 'register', defaultLabel: 'Register', ...defaultModuleNodeSize },
  { nodeType: 'module', shapeId: 'mux', defaultLabel: 'Mux', ...defaultModuleNodeSize },
  { nodeType: 'module', shapeId: 'alu', defaultLabel: 'ALU', ...defaultModuleNodeSize },
  { nodeType: 'module', shapeId: 'memory', defaultLabel: 'Memory', ...defaultModuleNodeSize },
]
