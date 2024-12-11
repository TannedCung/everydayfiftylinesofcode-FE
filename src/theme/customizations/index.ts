export { chartsCustomizations } from './charts';
export { dataGridCustomizations } from './dataGrid';
export { datePickersCustomizations } from './datePickers';
export { treeViewCustomizations } from './treeView';

import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

export const theme = extendTheme({
    colorSchemes: {
      light: {
        palette: {
          // light mode palette
        },
      },
      dark: {
        palette: {
          // dark mode palette
        },
      },
    },
  });