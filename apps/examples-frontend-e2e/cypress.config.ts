import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

const port = 4202;

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: `nx run persons-management-frontend:serve:development --port ${port}`,
        production: `nx run persons-management-frontend:serve:production --port ${port}`,
      },
      ciWebServerCommand: `nx run persons-management-frontend:serve:production --port ${port}`,
    }),
    baseUrl: `http://localhost:${port}`,
  },
});
