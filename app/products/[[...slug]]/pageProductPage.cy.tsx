import React from 'react'
import ProductPage from './page'

describe('<ProductPage />', () => {
  it('renders', () => {
    cy.mount(<ProductPage params={{slug: ['grocery', 'dairy', 'milk']}} />)
    cy.contains('ProductPage grocerydairymilk')
  })
})
