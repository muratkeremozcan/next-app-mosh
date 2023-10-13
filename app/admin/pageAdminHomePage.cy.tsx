import AdminHomePage from './page'
import AdminLayout from './layout'

describe('<AdminHomePage />', () => {
  it('should render the component in isolation', () => {
    cy.mount(<AdminHomePage />)
    cy.contains('Admin HomePage')
  })

  it('should render the component in with its layout', () => {
    cy.mount(
      <AdminLayout>
        <AdminHomePage />
      </AdminLayout>,
    )
    cy.getByCy('admin-home-page-comp').should('be.visible')
    cy.getByCy('admin-sidebar').should('be.visible')
  })
})
