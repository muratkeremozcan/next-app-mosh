import {defineConfig} from 'cypress'
// import plugins from './cypress/support/plugins'
import tasks from './cypress/support/tasks'
require('dotenv').config()

export default defineConfig({
  // @ts-expect-error yes
  experimentalSingleTabRunMode: true,
  chromeWebSecurity: false,
  projectId: 'kk89i2',

  retries: {
    runMode: 2,
    openMode: 0,
  },

  env: {
    ...process.env,
  },

  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      return tasks(on)
      // return plugins(on, config)
    },
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
