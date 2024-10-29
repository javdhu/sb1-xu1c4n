import React from 'react';
import { Button } from '@mantine/core';
import { Upload } from 'lucide-react';
import { VFGData } from '../types';

interface FileUploadProps {
  onUpload: (data: VFGData) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        onUpload(data);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Button
      component="label"
      leftSection={<Upload size={16} />}
      variant="light"
    >
      Upload JSON
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Button>
  );
}