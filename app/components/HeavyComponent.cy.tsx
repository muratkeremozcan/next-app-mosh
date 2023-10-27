import React from 'react'
import HeavyComponent from './HeavyComponent'

describe('<HeavyComponent />', () => {
  it('should render after a few seconds', () => {
    cy.mount(<HeavyComponent />)
    cy.contains('Loading...')
    cy.contains('My Heavy Component')
  })
})
