import React from 'react'
import AdminHomePage from './page'
import AdminLayout from './layout'

describe('<AdminHomePage />', () => {
  it('should render the component in isolation', () => {
    cy.mount(<AdminHomePage />)
    cy.contains('Admin HomePage')
  })

  // Cannot read properties of null (reading 'parentNode')
  // I think this is related to https://github.com/cypress-io/cypress/issues/27890, styles not rendering
  // it.skip('should render the component in with its layout', () => {
  //   cy.mount(
  //     <AdminLayout>
  //       <AdminHomePage />
  //     </AdminLayout>,
  //   )
  // })
})
