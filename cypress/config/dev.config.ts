import {defineConfig} from 'cypress'
import merge from 'lodash/merge'
import {baseConfig} from './base.config'

const specificConfig: Partial<Cypress.PluginConfigOptions> = {
  e2e: {
    baseUrl: 'https://next-app-mosh-cuvk662fv-muratkeremozcan.vercel.app/',
  },
}

export default defineConfig(merge({}, baseConfig, specificConfig))
