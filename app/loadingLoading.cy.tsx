import Loading from './loading'

describe('<Loading />', () => {
  it('renders', () => {
    cy.mount(<Loading />)
    cy.get('.loading').should('exist')
  })
})
