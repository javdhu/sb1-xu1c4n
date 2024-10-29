import React, { useState } from 'react';
import { Paper, Title, FileInput, Button, Text, Group, Stack, Progress } from '@mantine/core';
import { GraduationCap, Upload, AlertCircle } from 'lucide-react';
import { api } from '../api';

interface LearnCardProps {
  onLearnComplete: () => void;
}

export function LearnCard({ onLearnComplete }: LearnCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleLearn = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const text = await file.text();
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await api.learn({
        observations_csv: text,
        library: 'pgmpy',
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (response.success) {
        onLearnComplete();
      } else if (response.error) {
        setError(response.error);
      }
    } catch (error) {
      setError('Failed to learn parameters');
      console.error('Learning error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Stack spacing="md">
        <Group>
          <GraduationCap className="text-blue-500" size={20} />
          <Title order={4}>Learn Parameters</Title>
        </Group>
        
        <FileInput
          label="Upload Observations"
          description="Choose a CSV file with observation data"
          placeholder="observations.csv"
          accept=".csv"
          value={file}
          onChange={setFile}
          icon={<Upload size={14} />}
        />

        {loading && (
          <Stack spacing="xs">
            <Text size="sm">Learning in progress...</Text>
            <Progress 
              value={progress} 
              color="blue" 
              size="sm" 
              radius="xl" 
              striped 
              animated
            />
          </Stack>
        )}

        {error && (
          <Paper withBorder p="xs" bg="red.0">
            <Group>
              <AlertCircle size={16} className="text-red-500" />
              <Text size="sm" c="red">{error}</Text>
            </Group>
          </Paper>
        )}

        <Button
          fullWidth
          onClick={handleLearn}
          loading={loading}
          leftSection={<GraduationCap size={16} />}
          disabled={!file}
        >
          Learn Parameters
        </Button>
      </Stack>
    </Paper>
  );
}