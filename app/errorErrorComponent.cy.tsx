import ErrorComponent from './error'

describe('<ErrorComponent />', () => {
  it('should call error and retry on click', () => {
    cy.stub(console, 'error').as('error')
    cy.mount(
      <ErrorComponent error={new Error()} reset={cy.stub().as('reset')} />,
    )

    cy.get('@error').should('be.called')
    cy.contains('Retry').click()
    cy.get('@reset').should('be.called')
  })
})
