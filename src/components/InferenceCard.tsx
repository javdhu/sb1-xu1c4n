import React, { useState } from 'react';
import { Paper, Title, Select, Button, Group, Text, Progress, Stack } from '@mantine/core';
import { Brain, AlertCircle } from 'lucide-react';
import { VFGData } from '../types';
import { api } from '../api';

interface InferenceCardProps {
  data: VFGData;
  onInferComplete: () => void;
}

export function InferenceCard({ data, onInferComplete }: InferenceCardProps) {
  const [selectedVar, setSelectedVar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInfer = async () => {
    if (!selectedVar) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.infer({
        variable_id: selectedVar,
        evidence: {},
        library: 'pgmpy',
      });
      
      if (response.success && response.result) {
        setResult(response.result.probabilities);
      } else if (response.error) {
        setError(response.error);
      }
      onInferComplete();
    } catch (error) {
      setError('Failed to perform inference');
      console.error('Inference error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Stack spacing="md">
        <Group>
          <Brain className="text-blue-500" size={20} />
          <Title order={4}>Inference</Title>
        </Group>
        
        <Select
          label="Select Variable"
          description="Choose a variable to infer its probability distribution"
          placeholder="Choose a variable"
          data={Object.keys(data.variables)}
          value={selectedVar}
          onChange={setSelectedVar}
          searchable
        />

        <Button
          fullWidth
          onClick={handleInfer}
          loading={loading}
          leftSection={<Brain size={16} />}
          disabled={!selectedVar}
        >
          Infer Probabilities
        </Button>

        {error && (
          <Paper withBorder p="xs" bg="red.0">
            <Group>
              <AlertCircle size={16} className="text-red-500" />
              <Text size="sm" c="red">{error}</Text>
            </Group>
          </Paper>
        )}

        {result && (
          <Paper withBorder p="xs">
            <Text size="sm" fw={500} mb="xs">Probability Distribution:</Text>
            <Stack spacing="xs">
              {Object.entries(result).map(([key, value]) => (
                <div key={key}>
                  <Group position="apart" mb={4}>
                    <Text size="sm">{key}:</Text>
                    <Text size="sm" fw={500}>{(value * 100).toFixed(1)}%</Text>
                  </Group>
                  <Progress 
                    value={value * 100} 
                    color="blue" 
                    size="sm" 
                    radius="xl"
                  />
                </div>
              ))}
            </Stack>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
}