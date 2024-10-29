import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  useNodesState,
  useEdgesState,
  Controls,
  Panel,
  BackgroundVariant,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { VFGData } from '../types';
import { VariableNode } from './VariableNode';
import { FactorNode } from './FactorNode';
import { useMantineColorScheme } from '@mantine/core';

const nodeTypes = {
  variable: VariableNode,
  factor: FactorNode,
};

interface BayesianGraphProps {
  data: VFGData;
}

const nodeWidth = 200;
const nodeHeight = 80;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', ranksep: 100, nodesep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export function BayesianGraph({ data }: BayesianGraphProps) {
  const { colorScheme } = useMantineColorScheme();
  
  const createNodes = useCallback(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Create variable nodes
    Object.entries(data.variables).forEach(([varId, values]) => {
      nodes.push({
        id: varId,
        type: 'variable',
        data: { 
          label: varId,
          values,
        },
        position: { x: 0, y: 0 },
      });
    });

    // Create factor nodes and edges
    data.factors.forEach((factor, index) => {
      const factorId = `factor-${index}`;
      const label = `P(${factor.variables.join(' | ')})`;
      
      nodes.push({
        id: factorId,
        type: 'factor',
        data: { 
          label,
          distribution: factor.distribution,
          values: factor.values,
          numPorts: factor.variables.length,
        },
        position: { x: 0, y: 0 },
      });

      factor.variables.forEach((varId, idx) => {
        const handleId = `handle-${idx}`;
        edges.push({
          id: `${factorId}-${varId}`,
          source: factorId,
          target: varId,
          sourceHandle: handleId,
          animated: idx === 0,
          type: 'default',
          style: { stroke: '#228be6', strokeWidth: 2 },
        });
      });
    });

    return getLayoutedElements(nodes, edges);
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  React.useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = createNodes();
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [data, createNodes, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.1}
      maxZoom={2}
      defaultEdgeOptions={{
        type: 'bezier',
      }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        color={colorScheme === 'dark' ? '#373A40' : '#dee2e6'}
        gap={16}
      />
      <Controls />
      <Panel position="bottom-center" className="bg-white/80 dark:bg-gray-800/80 p-2 rounded-t-lg">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Scroll to zoom • Drag to pan • Click and drag nodes to move
        </div>
      </Panel>
    </ReactFlow>
  );
}