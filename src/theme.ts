import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  components: {
    Paper: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
  colorScheme: 'auto',
});