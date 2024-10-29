import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Paper, Text, Group, useMantineTheme } from '@mantine/core';

interface VariableNodeProps {
  data: {
    label: string;
    values: string[];
  };
}

export const VariableNode = memo(({ data }: VariableNodeProps) => {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === 'dark';

  return (
    <Paper 
      shadow="sm" 
      p="xs" 
      bg={isDark ? 'blue.9' : 'blue.0'} 
      style={{ minWidth: 180 }}
    >
      <Handle type="target" position={Position.Top} />
      <Group direction="column" spacing={4}>
        <Text fw={600} ta="center" w="100%" c={isDark ? 'white' : 'black'}>
          {data.label}
        </Text>
        <Text size="xs" c={isDark ? 'gray.4' : 'dimmed'} ta="center">
          Values: {data.values.join(', ')}
        </Text>
      </Group>
    </Paper>
  );
});

VariableNode.displayName = 'VariableNode';