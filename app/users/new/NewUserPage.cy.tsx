import NewUserPage from './page'

describe('<NewUserPage />', () => {
  it('renders', () => {
    cy.mount(<NewUserPage />)
    cy.contains('NewUserPage')
  })
})
