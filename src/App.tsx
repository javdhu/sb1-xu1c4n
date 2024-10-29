import React, { useCallback, useEffect, useState } from 'react';
import { Container, Grid, Paper, Text, Group, ActionIcon, Tooltip, useMantineColorScheme } from '@mantine/core';
import { FileUpload } from './components/FileUpload';
import { BayesianGraph } from './components/BayesianGraph';
import { InferenceCard } from './components/InferenceCard';
import { LearnCard } from './components/LearnCard';
import { VFGData } from './types';
import { exampleVFG } from './data/exampleVFG';
import { api } from './api';
import { Sun, Moon, Network } from 'lucide-react';

function App() {
  const [graphData, setGraphData] = useState<VFGData>(exampleVFG);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const fetchGraph = async () => {
    try {
      const data = await api.getGraph();
      setGraphData(data);
    } catch (error) {
      console.error('Error fetching graph:', error);
    }
  };

  useEffect(() => {
    api.setGraph(exampleVFG).then(fetchGraph);
  }, []);

  const handleFileUpload = useCallback(async (data: VFGData) => {
    try {
      await api.setGraph(data);
      await fetchGraph();
    } catch (error) {
      console.error('Error updating graph:', error);
    }
  }, []);

  return (
    <Container fluid py="xl">
      <Grid gutter="md">
        <Grid.Col span={9}>
          <Paper shadow="sm" p="md" mb="lg" className="relative">
            <Group justify="space-between" mb="md">
              <Group>
                <Network size={24} className="text-blue-500" />
                <Text size="xl" fw={700}>Bayesian Network Viewer</Text>
              </Group>
              <Group>
                <FileUpload onUpload={handleFileUpload} />
                <Tooltip label={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} mode`}>
                  <ActionIcon
                    variant="light"
                    onClick={() => toggleColorScheme()}
                    size="lg"
                  >
                    {colorScheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
            <Paper h={600} withBorder className="overflow-hidden rounded-lg">
              <BayesianGraph data={graphData} />
            </Paper>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={3}>
          <Grid gutter="md">
            <Grid.Col>
              <InferenceCard 
                data={graphData} 
                onInferComplete={fetchGraph} 
              />
            </Grid.Col>
            <Grid.Col>
              <LearnCard onLearnComplete={fetchGraph} />
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default App;