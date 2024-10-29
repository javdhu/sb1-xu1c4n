import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Paper, Text, useMantineTheme } from '@mantine/core';

interface FactorNodeProps {
  data: {
    label: string;
    distribution: string;
    values: number[] | number[][] | number[][][];
    numPorts: number;
  };
}

export const FactorNode = memo(({ data }: FactorNodeProps) => {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === 'dark';

  const getHandlePosition = (index: number, total: number) => {
    const spacing = 1 / (total + 1);
    return spacing * (index + 1) * 100;
  };

  return (
    <Paper 
      shadow="sm" 
      p="xs" 
      bg={isDark ? 'orange.9' : 'orange.0'} 
      style={{ minWidth: 180 }}
    >
      {Array.from({ length: data.numPorts }).map((_, index) => (
        <Handle
          key={`handle-${index}`}
          id={`handle-${index}`}
          type="source"
          position={Position.Bottom}
          style={{ left: `${getHandlePosition(index, data.numPorts)}%` }}
        />
      ))}
      <Text fw={600} ta="center" c={isDark ? 'white' : 'black'}>
        {data.label}
      </Text>
      <Text size="xs" c={isDark ? 'gray.4' : 'dimmed'} ta="center">
        {data.distribution}
      </Text>
    </Paper>
  );
});

FactorNode.displayName = 'FactorNode';