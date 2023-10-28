import {defineConfig} from 'cypress'
import merge from 'lodash/merge'
import {baseConfig} from './base.config'

const specificConfig: Partial<Cypress.PluginConfigOptions> = {
  e2e: {
    baseUrl: 'https://next-app-mosh-cuvk662fv-muratkeremozcan.vercel.app/',
    excludeSpecPattern: 'cypress/e2e/api/**/*', // not sure how we hit api routes in a deployment
  },
}

export default defineConfig(merge({}, baseConfig, specificConfig))
