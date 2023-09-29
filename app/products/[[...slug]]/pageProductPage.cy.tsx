import React from 'react'
import ProductPage from './page'

describe('<ProductPage />', () => {
  it('renders', () => {
    cy.mount(
      <ProductPage
        params={{slug: ['grocery', 'dairy', 'milk']}}
        searchParams={{sortOrder: 'name'}}
      />,
    )
    cy.contains('ProductPage grocerydairymilk, SortOrder name')
  })
})
